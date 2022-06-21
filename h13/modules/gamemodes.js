module.exports = {
    'Schere-Stein-Papier (Klassisch)': {
        'gestures': ['Schere', 'Stein', 'Papier'],
        'logic': {
            'Schere': ['Papier'],
            'Stein': ['Schere'],
            'Papier': ['Stein']
        }
    },
    '+Brunnen': {
        'gestures': ['Schere', 'Stein', 'Papier', 'Brunnen'],
        'logic': {
            'Schere': ['Papier'],
            'Stein': ['Schere'],
            'Papier': ['Stein', 'Brunnen'],
            'Brunnen': ['Stein', 'Schere']
        }
    },
    '+Brunnen+Streichholz': {
        'gestures': ['Schere', 'Stein', 'Papier', 'Brunnen', 'Streichholz'],
        'logic': {
            'Schere': ['Papier', 'Streichholz'],
            'Stein': ['Schere', 'Streichholz'],
            'Papier': ['Stein', 'Brunnen'],
            'Brunnen': ['Stein', 'Schere'],
            'Streichholz': ['Papier', 'Brunnen']
        }
    },
    '+Echse+Spock': {
        'gestures': ['Schere', 'Stein', 'Papier', 'Echse', 'Spock'],
        'logic': {
            'Schere': ['Papier', 'Spock'],
            'Stein': ['Schere', 'Spock'],
            'Papier': ['Stein', 'Echse'],
            'Echse': ['Stein', 'Schere'],
            'Spock': ['Papier', 'Echse']
        }
    },
}