DIR := $(dir $(lastword $(MAKEFILE_LIST)))

docs:
	(cd $(DIR)/ts && yarn doc)

docs-deploy: docs
	$(DIR)/sh/deploy-docs
