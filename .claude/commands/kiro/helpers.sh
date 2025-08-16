#!/bin/bash
count_custom_steering() {
    if [ ! -d ".kiro/steering" ]; then
        echo "📋 No steering directory yet"
        return
    fi
    
    local count=$(find .kiro/steering -maxdepth 1 -type f -name '*.md' ! -name 'product.md' ! -name 'tech.md' ! -name 'structure.md' | wc -l)
    if [ "$count" -gt 0 ]; then
        echo "🔧 $count custom file(s) found - Will be preserved"
    else
        echo "📋 No custom files"
    fi
}