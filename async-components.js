// Example: Network requests
window.onload = async () => {
    // Pure functions
    const appendChild = parent => child => parent.appendChild(child);
    const getElementById = doc => idString => doc.getElementById(idString);
    const yieldWrappingElement = doc => doc.createElement('div');
    const yieldFirstComponent = PromiseConstructor => timeoutUtility => ({
        content: '<div>First component</div>',
        state: new PromiseConstructor((res, rej) => {
            timeoutUtility(() => res({ newState: 'first component state' }), 1000)
        })
    });
    const yieldSecondComponent = PromiseConstructor => timeoutUtility => ({
        content: '<div>Second component</div>',
        state: new PromiseConstructor((res, rej) => {
            timeoutUtility(() => res({ newState: 'second component state' }), 1000)
        })
    });
    const assignComponentToWrapper = wrapper => component => {
        return AsyncEffect.of(() => {
            wrapper.innerHTML = component.content;
            return component.state;
        });
    }

    // Pure program
    const firstComponentEffect = AsyncEffect.of(setTimeout).ap(AsyncEffect.of(Promise).map(yieldFirstComponent));
    const secondComponentEffect = AsyncEffect.of(setTimeout).ap(AsyncEffect.of(Promise).map(yieldSecondComponent));
    const rootElementEffect = AsyncEffect.of(window.document).map(yieldWrappingElement);
    const asyncAppendChildToTestBodyEffect = AsyncEffect.of('testbody').ap(AsyncEffect.of(window.document).map(getElementById)).map(appendChild);

    const workflow = async rootElement => {
        const firstComponentStep = await firstComponentEffect.ap(AsyncEffect.of(rootElement).map(assignComponentToWrapper)).join();
        const secondComponentStep = await secondComponentEffect.ap(AsyncEffect.of(rootElement).map(assignComponentToWrapper)).join();

        // Can I make it so that the steps take state & return state?
        return AsyncEffect.of(() => {})
            .ap(firstComponentStep)
            .ap(secondComponentStep);
    }

    // Effectful execution
    const program = await rootElementEffect
        .ap(asyncAppendChildToTestBodyEffect)
        .chain(workflow);
    program.run();
}
