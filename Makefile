all:
	nodemon genLabel.js

deploy:
	git push origin master
	git push prod master
