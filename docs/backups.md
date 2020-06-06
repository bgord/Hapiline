**Database backup**

- To create a DB backup:

```bash
$ export DOCKER_HOST="ssh://<user>@<ip>:<optional port>"
$ ./scripts/backup_db.sh
```

- Accessing the backup file:

The file is created in the `/backups` directory inside the `db` container which is mapped to `/usr/src/hapiline_backups` on VPS machine.

```bash
$ <ssh to the VPS>
$ cd /usr/src/hapiline_backups
$ ls -l

# Example output
-rw-r--r--    1 root     root         32542 Jun  6 16:10 hapiline_backup_<timestamp>
```

To move a backup file from the VPS to your local machine:

```bash
$ scp <user>@<ip>:/usr/src/hapiline_backups some/local/dir
```

- Apply the backup file

```bash
$ docker-compose exec -T db psql -U docker -w hapiline < hapiline_backup_<timestamp>
```
