from pathlib import Path
import hashlib, json
import subprocess

p = Path(__file__).resolve().parent
m = json.loads((p / '校验清单.json').read_text(encoding='utf-8'))
for name, info in m['files'].items():
    b = (p / name).read_bytes()
    assert len(b) == info['bytes'] and hashlib.sha256(b).hexdigest() == info['sha256'], name
original = (p / 'original/智集优管-app.html').read_bytes()
assert hashlib.sha256(original).hexdigest() == m['source_sha256']
entrypoint = (p / 'index.html').read_bytes()
for r in m['blocks']:
    start, end = r['original_start_byte'], r['original_end_byte']
    opening = r['opening'].encode('utf-8')
    closing = r['closing'].encode('utf-8')
    body = original[r['body_start_byte']:r['body_end_byte']]
    assert original[start:end] == opening + body + closing
    assert hashlib.sha256(body).hexdigest() == r['body_sha256']
    assert entrypoint.count(r['replacement'].encode('utf-8')) == 1
assert hashlib.sha256((p / 'assets/css/style.css').read_bytes()).hexdigest() == m['blocks'][0]['body_sha256']
check = subprocess.run(
    ['node', '--check', str(p / 'assets/js/app.js')],
    cwd=p,
    capture_output=True,
    text=True,
)
if check.returncode:
    raise RuntimeError(check.stderr or check.stdout)
print('PASS: source snapshot, entrypoint references and extracted assets verified; JavaScript syntax is valid.')
