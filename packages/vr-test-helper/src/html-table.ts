export class HTMLTable {
    private table = '';
    private hColumns: {key: string, value: string, width?: string }[] = [];
    private header: string = '';
    private body: string = '';

    constructor(header: {key: string, value: string, width?: string}[], data: { [key: string]: string }[] = null){
        this.buildHeader(header);
        if(data && data.length > 0){
            this.buildBody(data);
        }
    }

    public buildHeader(header: {key: string, value: string, width?: string }[]): void {
        this.hColumns = header;
        this.header =
            '<thead>'
            + '<tr>'
            + header.map(c => `<th scope="col" ${c.width ? 'style="width:' + c.width + ';"' : ''}> ${c.value} </th>`).join('')
            + '</tr>'
            + '</thead>';
        this.buildTable();
    }

    public buildBody(data: { [key: string]: string }[]): void {
        this.body =
            '<tbody>'
            + data.map(d => {
                return '<tr>'
                    + this.hColumns.map(c => {
                        if (c.key in d && d[c.key]) {
                            return `<td ${c.width ? 'style="width:' + c.width + ';"' : ''}> ${d[c.key]} </td>`;
                        }
                        return '<td></td>';
                    }).join('')
                    + '</tr>';
            }).join('')
            + '</tbody>';
        this.buildTable();
    }

    public getTable(): string {
        return this.table;
    }

    private buildTable(): void {
        this.table = '<table class="table" style="table-layout: fixed;">'+this.header+this.body+'</table>';
    }
}
