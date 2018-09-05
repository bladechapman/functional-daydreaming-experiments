// Example: Network requests
window.onload = async () => {
    // Pure functions
    const assignInnerHTMLToElement = element => innerHTML => {
        element.innerHTML = innerHTML;
        return element;
    };
    const appendChild = parent => child => parent.appendChild(child);
    const getElementById = doc => idString => doc.getElementById(idString);
    const wrappingElement = document.createElement('div');
    const yieldFirstComponent = PromiseConstructor => timeoutUtility => ({
        content: 'first component',
        state: new PromiseConstructor((res, rej) => {
            timeoutUtility(() => res({ newState: 'some new state' }), 1000)
        })
    });
    const logStep = logger => loggee => { logger.log(loggee) }
    const assignComponentToWrapper = wrapper => component => {
        const assignInnerHtmlToWrapper = AsyncEffect.of(wrapper).map(assignInnerHTMLToElement);
        return AsyncEffect.of(component.content)
            .ap(assignInnerHtmlToWrapper)
            .chain(async () => await component.state);
    }

    // Pure program
    const asyncGetElementByIdFromDocumentEffect = AsyncEffect.of(window.document).map(getElementById);
    const asyncAppendChildToTestBodyEffect = AsyncEffect.of('testbody').ap(asyncGetElementByIdFromDocumentEffect).map(appendChild);
    const yieldFirstComponentEffect = AsyncEffect.of(setTimeout).ap(AsyncEffect.of(Promise).map(yieldFirstComponent));

//     const firstComponentStep = wrapper => {
//         const assignComponentToGivenWrapper = AsyncEffect.of(wrapper).map(assignComponentToWrapper);
//         return yieldFirstComponentEffect.ap(assignComponentToGivenWrapper);
//     }

    /**
     * @define Component<b, c> {content: b, state: c}
     *
     * @param {a} wrapper
     * @param {a -> Component<b, c> -> AsyncEffect<c>} assignComponentToWrapper
     * @param {AsyncEffect<Component<b, c>>} yieldComponentEffect
     * @return {AsyncEffect<c>}
     */
    const componentStep = wrapper => assignComponentToWrapper_2 => yieldComponentEffect => {
        const assignComponentToGivenWrapper = AsyncEffect.of(wrapper).map(assignComponentToWrapper_2);
        return yieldComponentEffect.ap(assignComponentToGivenWrapper).join();
    }

    const firstComponentStep = await
        AsyncEffect.of(yieldFirstComponentEffect).ap(
            AsyncEffect.of(assignComponentToWrapper).ap(
                AsyncEffect.of(wrappingElement).map(componentStep)
            )
        );

    // TESTING
    // await AsyncEffect.of(wrappingElement).ap(asyncAppendChildToTestBodyEffect).run()
    // const test = await firstComponentStep.run()
    // const test2 = await test.run()
    // console.log(test2)

    const test = await
        (
            await AsyncEffect.of(wrappingElement).ap(asyncAppendChildToTestBodyEffect)
                
                .chain(() => firstComponentStep)
        )

        .run()

    console.log(test)

    // const test2 = await firstComponentStep.run();
    // console.log(test2)
    // TESTING


    const consoleLogEffect = AsyncEffect.of(console).map(logStep);

//     // Effectful execution
//     AsyncEffect.of(wrappingElement)
//         .ap(asyncAppendChildToTestBodyEffect)
//         .map(firstComponentStep)
//         .ap(consoleLogEffect)
//         .run()

}
