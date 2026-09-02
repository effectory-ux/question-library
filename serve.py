import http.server
import os

PORT = int(os.environ.get("PORT", 3000))
# Serve the folder this script sits in (was hard-coded to one machine's Downloads path)
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

LANDING = "/prototypes/question-library-questions.html"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        # the repo root has no index page — send visitors to the prototype
        if self.path in ("/", "/index.html"):
            self.send_response(302)
            self.send_header("Location", LANDING)
            self.end_headers()
            return
        super().do_GET()

    def end_headers(self):
        # always serve fresh — no browser caching during design iteration
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

with http.server.HTTPServer(("", PORT), Handler) as httpd:
    print(f"Serving {DIRECTORY} at http://localhost:{PORT}")
    httpd.serve_forever()
