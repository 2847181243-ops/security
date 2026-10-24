import glob, sys
from sigma.collection import SigmaCollection
from sigma.backends.splunk import SplunkBackend
backend = SplunkBackend()
files = sorted(glob.glob(r"<workspace>/docs/security/detections/*.yml"))
ok = 0; bad = 0
for f in files:
    try:
        c = SigmaCollection.from_yaml(open(f, encoding="utf-8").read())
        qs = backend.convert(c)
        print("==", f.split("/")[-1], "queries=" + str(len(qs)))
        for q in qs:
            print(q[:400])
        ok += 1
    except Exception as e:
        print("==", f.split("/")[-1], "ERROR", str(e)[:160])
        bad += 1
print("files=" + str(len(files)) + " ok=" + str(ok) + " bad=" + str(bad))
sys.exit(1 if bad else 0)
