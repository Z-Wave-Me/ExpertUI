#!/bin/bash

ROOT=expert

TMPDIR=`mktemp -d`
DIR=$TMPDIR/$ROOT

cp -R dist $DIR

# remove all non-gz files if .gz are present
for f in `find $DIR`; do
	if [ -f $f.gz ]; then
		rm $f
	fi
done

# gzip everything to yet gzipped
for f in `find $DIR ! -name '*.gz' -type f`; do
	gzip $f
done

# remove .eot files if .woff2 is present
for f in `find $DIR -name '*.eot.gz'`; do
	if [ -f ${f%%.eot.gz}.woff2.gz ]; then
		rm $f
	fi
done

# remove unused files
rm $DIR/LICENCE.md.gz
find $DIR -name '*.map.gz' -exec rm {} \;

tar -cf $ROOT.tar -C $TMPDIR $ROOT

rm -R $DIR
