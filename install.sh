#! /bin/bash
echo "************************** Installing piBoard **************************"
npm install

echo "************************** Installing piBoard Plugins **************************"
for d in "./plugins/"*; do
    if [ -d "${d}" ]; then
      echo "************************** Installing ${d} **************************"
      (cd ${d} && npm install)
      if [ -f "${d}/install.sh" ]; then
        (cd ${d} && chmod 755 ./install.sh)
        (cd ${d} && ./install.sh)
      fi
    fi
done

echo "************************** Installing piBoard autorun *******************************"
chmod 755 ./setup-autorun-rpi.sh
./setup-autorun-rpi.sh

echo "*************************************************************************************"
echo "************************** Thank You for installing piBoard**************************"
echo "*************************************************************************************"