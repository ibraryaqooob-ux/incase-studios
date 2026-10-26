#!/usr/bin/env python3
"""
INCASE STUDIOS — Multi-Threaded Local Server & Stripe Checkout API
High-concurrency Python 3 server with instant Mobile Phone & Desktop support.
"""

import http.server
import socketserver
import os
import sys
import json
import urllib.request
import urllib.parse
import webbrowser
import subprocess

PORT = 3000

def load_env_file():
    """Reads .env file without external dependencies."""
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        k = k.strip()
                        v = v.strip().strip('"').strip("'")
                        if k and not os.environ.get(k):
                            os.environ[k] = v
        except Exception:
            pass

load_env_file()
STRIPE_SECRET_KEY = os.environ.get("STRIPE_SECRET_KEY", "").strip()

def get_lan_ip():
    """Finds the local Wi-Fi / Ethernet IPv4 address of the Mac."""
    try:
        out = subprocess.check_output(['scutil', '--nwi'], text=True, stderr=subprocess.DEVNULL)
        for line in out.splitlines():
            line = line.strip()
            if line.startswith('address') and ':' in line:
                ip = line.split(':', 1)[1].strip()
                if ip and ip != '127.0.0.1':
                    return ip
    except Exception:
        pass
    try:
        out = subprocess.check_output(['ifconfig'], text=True, stderr=subprocess.DEVNULL)
        for line in out.splitlines():
            if 'inet ' in line and not '127.0.0.1' in line:
                parts = line.strip().split()
                if len(parts) >= 2:
                    return parts[1]
    except Exception:
        pass
    return "192.168.1.111"

class IncaseStudioHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # Route apple-touch-icon or favicon to existing assets if requested by mobile devices
        clean_path = self.path.split('?')[0].lower()
        if 'apple-touch-icon' in clean_path:
            if os.path.exists('assets/logo.png'):
                self.path = '/assets/logo.png'
            elif os.path.exists('assets/emblem.svg'):
                self.path = '/assets/emblem.svg'
        elif clean_path == '/favicon.ico':
            if os.path.exists('assets/emblem.svg'):
                self.path = '/assets/emblem.svg'

        super().do_GET()

    def copyfile(self, source, outputfile):
        try:
            super().copyfile(source, outputfile)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def do_POST(self):
        if self.path == "/create-checkout-session":
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                body = json.loads(post_data.decode('utf-8'))
            except Exception:
                body = {}

            secret_key = os.environ.get("STRIPE_SECRET_KEY", STRIPE_SECRET_KEY)
            
            if secret_key:
                try:
                    session_url = self.create_stripe_session(secret_key, body)
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"url": session_url}).encode('utf-8'))
                    return
                except Exception as e:
                    self.send_response(500)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                    return
            else:
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "status": "setup_needed",
                    "message": "STRIPE_SECRET_KEY is not set. Set STRIPE_SECRET_KEY environment variable to enable live card & Apple Pay payments."
                }).encode('utf-8'))
                return

        super().do_GET()

    def create_stripe_session(self, secret_key, body):
        items = body.get("items", [])
        success_url = body.get("success_url", "http://localhost:3000/?payment=success")
        cancel_url = body.get("cancel_url", "http://localhost:3000/?payment=cancelled")

        data_dict = {
            "mode": "payment",
            "success_url": success_url,
            "cancel_url": cancel_url,
            "billing_address_collection": "required",
            "shipping_address_collection[allowed_countries][0]": "GB",
            "shipping_address_collection[allowed_countries][1]": "US",
            "shipping_address_collection[allowed_countries][2]": "CA",
            "shipping_address_collection[allowed_countries][3]": "AU",
            "shipping_address_collection[allowed_countries][4]": "DE",
            "shipping_address_collection[allowed_countries][5]": "FR",
            "shipping_address_collection[allowed_countries][6]": "IE",
            "phone_number_collection[enabled]": "true"
        }

        for i, item in enumerate(items):
            title = item.get("title", "INCASE STUDIOS Print")
            price_pence = item.get("price", 700)
            qty = item.get("quantity", 1)

            data_dict[f"line_items[{i}][price_data][currency]"] = "gbp"
            data_dict[f"line_items[{i}][price_data][unit_amount]"] = str(price_pence)
            data_dict[f"line_items[{i}][price_data][product_data][name]"] = title
            data_dict[f"line_items[{i}][quantity]"] = str(qty)

        encoded_data = urllib.parse.urlencode(data_dict).encode('utf-8')
        req = urllib.request.Request(
            "https://api.stripe.com/v1/checkout/sessions",
            data=encoded_data,
            headers={
                "Authorization": f"Bearer {secret_key}",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )

        import ssl
        try:
            ctx = ssl.create_default_context()
            with urllib.request.urlopen(req, context=ctx) as resp:
                resp_data = json.loads(resp.read().decode('utf-8'))
                return resp_data.get("url")
        except Exception:
            ctx = ssl._create_unverified_context()
            with urllib.request.urlopen(req, context=ctx) as resp:
                resp_data = json.loads(resp.read().decode('utf-8'))
                return resp_data.get("url")

class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True

def run_server():
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    port = PORT
    lan_ip = get_lan_ip()
    
    for attempt in range(10):
        try:
            with ThreadingHTTPServer(("", port), IncaseStudioHandler) as httpd:
                print(f"\n============================================================")
                print(f"🎨 INCASE STUDIOS — Precision Print Atelier Server")
                print(f"============================================================")
                print(f"💻 Mac / Desktop:   http://localhost:{port}")
                print(f"📱 Mobile Phone:    http://{lan_ip}:{port}")
                print(f"   (Ensure your phone is connected to the same Wi-Fi)")
                if os.environ.get("STRIPE_SECRET_KEY"):
                    print(f"💳 Stripe Live/Test Mode: ACTIVE")
                else:
                    print(f"💳 Stripe Payments: Ready (Set STRIPE_SECRET_KEY for live processing)")
                print(f"👉 Press Ctrl+C to stop the server")
                print(f"============================================================\n")
                httpd.serve_forever()
                break
        except OSError as e:
            if "Address already in use" in str(e):
                port += 1
            else:
                raise e

if __name__ == "__main__":
    try:
        run_server()
    except KeyboardInterrupt:
        print("\nServer stopped.")
        sys.exit(0)
