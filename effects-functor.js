const Effect = (f) => ({

    map: g => Effect(() => g(f())),

    run: () => f(),

    join: () => f(),

    chain: g => Effect(f).map(g).join(),

    ap: eff => eff.map(g => g(f())),
})

Effect.of = a => Effect(() => a);


// TODO Async functions return promises, which screw up chaining
const AsyncEffect = (f) => ({

    map: g => AsyncEffect(async () => await g(await f())),

    // can we extend native promises to make this more chainable?
    run: async () => await f(),

    // can we extend native promises to make this more chainable?
    join: async () => await f(),

    chain: async g => await AsyncEffect(f).map(g).join(),

    ap: eff => eff.map(async g => await g(await f())),

});

AsyncEffect.of = a => AsyncEffect(async () => a);

