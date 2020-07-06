export default Pie;

declare function Pie({ sections, radius, innerRadius, backgroundColor, strokeCap, dividerSize }: {
    sections: any;
    radius: any;
    innerRadius: any;
    backgroundColor: any;
    strokeCap: any;
    dividerSize: any;
}): JSX.Element;

declare namespace Pie {
    export namespace propTypes {
        export const sections: any;
        export const radius: any;
        export const innerRadius: any;
        export const backgroundColor: any;
        export const strokeCap: any;
        export const dividerSize: any;
    }
    export namespace defaultProps {
        const dividerSize_1: number;
        export { dividerSize_1 as dividerSize };
        const innerRadius_1: number;
        export { innerRadius_1 as innerRadius };
        const backgroundColor_1: string;
        export { backgroundColor_1 as backgroundColor };
        const strokeCap_1: string;
        export { strokeCap_1 as strokeCap };
    }
}
