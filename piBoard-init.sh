#! /bin/sh
# /etc/init.d/piboard-init

### BEGIN INIT INFO
# Provides:          node-server
# Required-Start:    $remote_fs $syslog
# Required-Stop:     $remote_fs $syslog
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
### END INIT INFO

# change this to wherever your node app lives #
path_to_node_app=replace-me-with-piBoard-path/piBoard.js
path_to_log_file=/home/pi/piboard.log
# Carry out specific functions when asked to by the system
case "$1" in
  start)
    echo "* starting piBoard * "
    echo "* starting piBoard * [`date`]" >> $path_to_log_file
    /usr/local/bin/node $path_to_node_app >> $path_to_log_file 2>&1&
    ;;
  stop)
    echo "* stopping piboard * "
    echo "* stopping piboard * [`date`]" >> $path_to_log_file
    killall /usr/local/bin/node
    ;;
  *)
    echo "Usage: {start|stop}"
    exit 1
    ;;
esac

exit 0
