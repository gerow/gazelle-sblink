ZIP       := zip

ALL_FILES := $(wildcard *)
FILES     := $(filter-out gazelle-sblink.zip, $(ALL_FILES))

all: gazelle-sblink.zip

gazelle-sblink.zip: $(FILES)
	$(ZIP) $@ $?

.PHONY: clean

clean:
	-rm -f gazelle-sblink.zip
