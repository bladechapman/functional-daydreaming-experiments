const Effect = (f) => ({

    map: g => Effect(() => g(f())),

    run: () => f(),

    join: () => f(),

    chain: g => Effect(f).map(g).join(),

    ap: eff => eff.map(g => g(f())),
})

Effect.of = a => Effect(() => a);


const AsyncEffect = (f) => ({

    map: g => AsyncEffect(async () => await g(await f())),

    run: async () => await f(),

    join: async () => await f(),

    chain: async g => await AsyncEffect(f).map(g).join(),

    ap: eff => eff.map(async g => await g(await f())),

});

AsyncEffect.of = a => AsyncEffect(async () => a);

