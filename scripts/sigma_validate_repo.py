import glob, sys
from sigma.collection import SigmaCollection
files = sorted(glob.glob("rules/sigma/*.yml"))
ok = bad = 0
for f in files:
    try:
        c = SigmaCollection.from_yaml(open(f, encoding="utf-8").read())
        print(f, "rules=" + str(len(c.rules)))
        ok += 1
    except Exception as e:
        print(f, "ERROR", str(e)[:120])
        bad += 1
print("files=" + str(len(files)) + " ok=" + str(ok) + " bad=" + str(bad))
sys.exit(1 if bad else 0)
