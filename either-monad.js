// Documentation: [fantasy-land](https://github.com/fantasyland/fantasy-land#monad)
//
// "A value that implements the Monad specification must also implement the Applicative and Chain specifications."
//
// "A value that implements the Applicative specification must also implement the Apply specification."
// "A value that implements the Chain specification must also implement the Apply specification"
//
// "A value that implements the Apply specification must also implement the Functor specification."

const Either = {

    Left: a => ({

        // "A value which has a Functor must provide a map method."
        map: () => Either.Left(a),

        // "A value which has an Apply must provide an ap method."
        ap: () => Either.Left(a),

        // "A value which has a Chain must provide a chain method"
        chain: () => Either.Left(a),
        join: () => a
    }),

    Right: a => ({

        // "A value which has a Functor must provide a map method."
        map: f => Either.Right(f(a)),

        // "A value which has an Apply must provide an ap method."
        ap: apply => apply.map(f => f(a)),

        // "A value which has a Chain must provide a chain method"
        chain: f => Either.Right(a).map(f).join(),
        join: () => a
    })
};

// A value which has an Applicative must provide an of function on its type representative
Either.of = a => Either.Right(a);


const test = Either.of('some-value').chain(val =>{
    const jsType = typeof val;
    if (jsType === 'string') return Either.Right(jsType)
    else return Either.Left(jsType);
});

console.log(test)
