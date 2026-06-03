import http.server, socketserver, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)
    def log_message(self, *a):
        pass
with socketserver.TCPServer(("127.0.0.1", 8766), H) as httpd:
    httpd.serve_forever()
