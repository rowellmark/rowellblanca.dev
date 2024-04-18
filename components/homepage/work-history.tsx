import Accordion from "../ui/accordion";

export default function WorkHistory() {
    return (
        <>
            <div>
                <Accordion title="Accordion Title 1" initiallyOpen={true}>
                    <p>Accordion Content 1</p>
                </Accordion>
                <Accordion title="Accordion Title 2">
                    <p>Accordion Content 2</p>
                </Accordion>
            </div>
        </>
    )
}