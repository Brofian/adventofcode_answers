import AbstractRiddle from '../../src/JS/AbstractRiddle';
import Vector from '../../src/JS/Geometry/Vector';


class Y2023_Day20_2 extends AbstractRiddle {

    riddle: string = "How many button presses are required to trigger a LOW pulse on the rx module?";

    run(): number {

        /*
        As this was a structural complexity problem, I decided to solve it by observing patterns and by hand.
        See the attached image for a visualization of the dependency graph.

        Observations:

        FlipFlop: toggles on LOW
        Conjunction: HIGH as long as one input is LOW (with one input: inverting the signal)

        rx receives a HIGH signal, if the conjunctions mr,vv,bl and pv all gave out a LOW signal
        (the nodes in between only act as inverter connections)

        The nodes mr,vv,bl and pv each are the center of their own (unclosed) circle of flip-flops with arbitrary connections.
        This means, the flip-flops have to be solved one by one.

        The broadcaster is directly connected to the first flip-flop of each unclosed circle, which itself has
        a two-way connection with their center.
        As the broadcaster will always send a LOW signal (that's what it gets from the button),
        the first flip-flops will toggle at each button press.

        This will cause the center to push another pulse back and to all connected nodes. As the center
        emits an HIGH pulse, until all Inputs are HIGH.
        So this backwarts signal only ever causes changes in the flip-flop, once all flip-flops are HIGH


        // now solve one by one: vv
        fb is on every 2^1 button presses
        zd is on every 2^2 button presses
        gv is on every 2^3 button presses
        lx is on every 2^4 button presses
        rs is on every 2^5 button presses
        hp is on every 2^6 button presses
        bj is on every 2^7 button presses
        rd is on every 2^8 button presses
        tp is on every 2^0 button presses
        sm is on every 2^10 button presses
        bv is on every 2^11 button presses
        qb is on every 2^12 button presses

        (combine these to get the binary representation of the input nodes of the conjunction)

        vv will trigger at 0b111111010001 = 4049, then reset some parts and end up with zero again (found out by adding the binary representation of tehe changes)
        -> it has a cycle of 4049 presses

        mr will trigger at 0b111100001011 = 3851, then reset some parts and end up with zero again
        -> it has a cycle of 3851 presses

        bl will trigger at 0b111110110101 = 4021, then reset some parts and end up with zero again
        -> it has a cycle of 4021 presses

        pv will trigger at 0b111100100101 = 3877, then reset some parts and end up with zero again
        -> it has a cycle of 3877 presses

        this means, they will all trigger at the lcm(4049, 3851, 4021, 3877)-th press


     */

        const lcm = (...arr: number[]) => {
            const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
            const _lcm = (x: number, y: number): number => (x * y) / gcd(x, y);
            return [...arr].reduce((a, b) => _lcm(a, b));
        };


        return lcm(4049, 3851, 4021, 3877);
    }

}

// noinspection JSUnusedGlobalSymbols
export default (new Y2023_Day20_2());