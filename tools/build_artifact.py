"""Builds the claude.ai artifact version of the page: the artifact viewer supplies its own <html>/<head>/<body>
skeleton, so this strips the standalone wrapper from index.html.  Usage: python3 tools/build_artifact.py OUT.html"""
import re, sys
src = open('index.html', encoding='utf-8').read()
head = src[src.index('<title>'):src.index('</style>')]
head = re.sub(r'\n/\* standalone reset[\s\S]*$', '\n', head)
body = src[src.index('<body>') + len('<body>'):src.rindex('</body>')]
open(sys.argv[1], 'w', encoding='utf-8').write(head + '</style>\n' + body.strip() + '\n')
print('wrote', sys.argv[1])
