#!/bin/bash

# Script para verificar configuração de DNS
echo "========================================="
echo "   VERIFICADOR DE DNS PARA FIREBASE"
echo "========================================="
echo ""

# Solicita o domínio
read -p "Digite seu domínio (ex: carteiravirtual.com.br): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo "❌ Erro: Domínio não pode estar vazio"
    exit 1
fi

echo ""
echo "🔍 Verificando DNS para: $DOMAIN"
echo ""

# Verifica registros A
echo "📌 Registros A:"
dig +short A $DOMAIN | while read ip; do
    echo "  ✓ $ip"
done

echo ""

# Verifica registros AAAA (IPv6)
echo "📌 Registros AAAA (IPv6):"
dig +short AAAA $DOMAIN | while read ip; do
    echo "  ✓ $ip"
done

echo ""

# Verifica www
echo "📌 Registros A para www.$DOMAIN:"
dig +short A www.$DOMAIN | while read ip; do
    echo "  ✓ $ip"
done

echo ""
echo "========================================="
echo "IPs esperados do Firebase Hosting:"
echo "  • 151.101.1.195"
echo "  • 151.101.65.195"
echo "========================================="
