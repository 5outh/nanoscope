var within = function (target, alpha) {
    return this.filtering(function (elem) {
        return (target - alpha) < elem  && elem < (target + alpha);
    });
};

nanoscope.mixin({within: within});

nanoscope([10, 2.5, 3]).within(3.5, 1.5).get();