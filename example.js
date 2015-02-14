var nanoscope = require('nanoscope'),
    game,
    lens,
    firstGhostX,
    clydesTraits;

game = {
    player: {
        location: { x: 6, y: 10},
        color: 'Yellow',
        unnecessaryInformation: 'nobody-cares'
    },
    enemies: [
        {
            location: { x: 10, y: 20 },
            name: 'Pinky',
            traits: ['Mischievous','Persistent', 'Tricky']
        },
        {
            location: {
                x: 2, y: 22
            },
            name: 'Clyde',
            traits: ['Ignorant', 'Goofy', '##$@??']
        }
    ],
    pelletLocations: [{ x: 10, y: 12 }, {x: 11, y: 15 }]
};

lens = nanoscope(game);

// Add a first name to the player
game = lens.path('player.name.first').set('Pac-Man');


// Get the x coordinate of the first ghost in the list
firstGhostX = lens.path('enemies').indexing(0).path('location.x').get();

// Add one to both the x and y coordinates of the player
game = lens.following('player.location')
            .plucking(['x', 'y'])
            .map(function (coordinate) {
                return coordinate + 1;
            });

// get Clyde's traits that aren't bogus (suppose clyde doesn't exist, we get [])
clydesTraits = lens.path('enemies')
    .filter(function (enemy) {
        return enemy.name === 'Clyde';
    })
    .index(0)
    .path('traits')
    .filter(/[a-zA-Z]/)
    .get();