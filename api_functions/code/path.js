var obj = {
    a: {
        b: 'flintstones'
    }
}, lens = nanoscope(obj);

nanoscope.path('a.b').get();

nanoscope.path('a.b.c.d').get();

nanoscope.path('a.b.c.d').set('vitamins');