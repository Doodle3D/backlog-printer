# start:
# 	./node_modules/.bin/browser-sync start --config bs-config.js

dist:
	rm -rf dist
	mkdir dist
	jspm bundle-sfx src/app dist/app.js
	./node_modules/.bin/html-dist index.html --remove-all --minify --insert app.js -o dist/index.html
	mkdir -p dist/style
	cp style/normalize.css dist/style
	cp style/style.css dist/style

deploy:dist
	scp -r dist/* doodle3d.com:/domains/doodle3d.com/DEFAULT/backlog-printer

# test:
# 	./node_modules/.bin/browser-sync start --config bs-config-test.js

bundle-deps:
	jspm bundle 'src/**/* - [src/**/*]' bundle.js --inject

.PHONY: dist test
