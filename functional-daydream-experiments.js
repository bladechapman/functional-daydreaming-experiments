window.onload = async () => {

//     // Example: DOM manipulation

//     // Pure functions
    const assignInnerHTMLToElement = element => innerHTML => {
        element.innerHTML = innerHTML;
        return element;
    };
    const appendChild = parent => child => parent.appendChild(child);
    const getElementById = doc => idString => doc.getElementById(idString);

// //     // Pure program
//     // const wrappingElement = document.createElement('div');
//     // const assignInnerHTMLToWrappingElementEffect = Effect.of(wrappingElement).map(assignInnerHTMLToElement);
// //     const getElementByIdFromDocumentEffect = Effect.of(window.document).map(getElementById);
// //     const appendChildToTestBodyEffect = Effect.of('testbody').ap(getElementByIdFromDocumentEffect).map(appendChild);
// //     const program = Effect.of('Some Contents').ap(assignInnerHTMLToWrappingElementEffect).ap(appendChildToTestBodyEffect);

// //     // Effectful execution
// //     program.run();



//     // Example: Network requests

//     // Pure functions
//     const fakeNetworkRequest = async PromiseConstructor => new PromiseConstructor((res, rej) => {
//         setTimeout(() => res('someJSON'), 1000);
//     });

//     const secondFakeNetworkRequest = async PromiseConstructor => new PromiseConstructor((res, rej) => {
//         setTimeout(() => res('some New JSON'), 1000);
//     });

    const wrappingElement = document.createElement('div');
    const asyncGetElementByIdFromDocumentEffect = AsyncEffect.of(window.document).map(getElementById);
    const asyncAppendChildToTestBodyEffect = AsyncEffect.of('testbody').ap(asyncGetElementByIdFromDocumentEffect).map(appendChild);

    const yieldFirstComponent = PromiseConstructor => timeoutUtility => ({
        content: 'first component',
        state: new PromiseConstructor((res, rej) => {
            timeoutUtility(() => res({ newState: 'some new state' }), 1000)
        })
    });

    const yieldFirstComponentEffect = AsyncEffect.of(setTimeout).ap(AsyncEffect.of(Promise).map(yieldFirstComponent));

    const firstComponentStep = wrapper => {
        const assignInnerHtmlToWrapper = AsyncEffect.of(wrapper).map(assignInnerHTMLToElement);
        return yieldFirstComponentEffect.map(component => {
            return AsyncEffect.of(component.content)
                .ap(assignInnerHtmlToWrapper)
                .map(async () => await component.state)
                .run()
        }).run();
    }

    const logStep = logger => loggee => {
        logger.log(loggee)
    }
    const consoleLogEffect = AsyncEffect.of(console).map(logStep);

    AsyncEffect.of(wrappingElement)
        .ap(asyncAppendChildToTestBodyEffect)
        .map(firstComponentStep)
        .ap(consoleLogEffect)
        // .map(s => console.log(s))
        .run()

}


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

