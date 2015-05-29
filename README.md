### Drush Make

Requires drush version 6.x or 7.x.

Create a full version with drush make:

```
git clone --branch 7.x-2.2 https://github.com/fusionx1/xeditor.git
cd xeditor
drush make --prepare-install build-xeditor.make webroot
cd webroot
drush site-install xeditor --db-url="mysql://DBUSER:DBPASS@localhost/DBNAME"
```
