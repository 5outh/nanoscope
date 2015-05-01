"use strict";

var nanoscope = require('../index');

describe('pathChain', function () {
    it('should set the appropriate key', function () {
        var game = {
            player: {
            }
        };

        var game2 = nanoscope(game).path('player')
                        .path('name')
                        .path('first')
                        .set('Pac-Man');

        expect(game2.player.name.first).to.equal('Pac-Man');
    });
});
