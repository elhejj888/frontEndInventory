const sectionWrapper = (WrappedComponent) => {
    return function SectionWrapper(props) {
        return (
            <section className="w-full m-2 p-2">
                <WrappedComponent {...props} />
            </section>
        );
    }
}
export default sectionWrapper;