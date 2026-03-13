#!/bin/bash
# Tusi Linux/macOS Kurulum Betiği
INSTALL_DIR="/usr/local/bin"

if [ -f "./tusi" ]; then
    sudo cp ./tusi $INSTALL_DIR/tusi
    sudo chmod +x $INSTALL_DIR/tusi
    echo "Tusi başarıyla /usr/local/bin/tusi konumuna kuruldu."
else
    echo "Hata: 'tusi' binary dosyası bulunamadı."
fi
