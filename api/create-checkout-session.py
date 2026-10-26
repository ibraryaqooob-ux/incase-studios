import os
import json
import urllib.request
import urllib.parse
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            body = {}

        secret_key = os.environ.get("STRIPE_SECRET_KEY", "").strip()
        
        if not secret_key:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "setup_needed",
                "message": "STRIPE_SECRET_KEY environment variable is not configured. Add it in your Vercel/Hosting dashboard to accept live payments."
            }).encode('utf-8'))
            return

        items = body.get("items", [])
        host = self.headers.get('Host', '')
        proto = self.headers.get('X-Forwarded-Proto', 'https')
        base_url = f"{proto}://{host}"
        
        success_url = body.get("success_url") or f"{base_url}/?payment=success"
        cancel_url = body.get("cancel_url") or f"{base_url}/?payment=cancelled"

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
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"url": resp_data.get("url")}).encode('utf-8'))
        except Exception:
            try:
                ctx = ssl._create_unverified_context()
                with urllib.request.urlopen(req, context=ctx) as resp:
                    resp_data = json.loads(resp.read().decode('utf-8'))
                    self.send_response(200)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"url": resp_data.get("url")}).encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
