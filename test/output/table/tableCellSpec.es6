import {TableCell} from 'output/table/tableCell';

describe('TableCell', function() {
    it('constructor', function() {
        let cell = new TableCell(10, { colspan: 2 });
        expect(cell.value).toBe(10);
        expect(cell.options).toEqual({ colspan: 2 });
    });
});
