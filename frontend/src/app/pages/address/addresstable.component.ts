import { Component } from '@angular/core';
import { NbDateService } from '@nebular/theme';

import { Incidence } from '../../@core/data/models/incidence';
import { Vehicle, VehicleService, VehicleTableServerDataSource } from '../../@core/data/models/vehicle';

@Component({
  selector: 'ngx-address-table',
  templateUrl: './addresstable.component.html',
})
export class AddressTableComponent {


  protected today: Date;
  protected DATEFORMAT = 'dd/MM/yyyy';
  protected PLATEREGEX = '([0-9]{4}[A-Za-z]{3})|([A-Za-z]{1,2}[0-9]{4}[A-Za-z]{1,2})';

  protected currentVeEdit:  Vehicle = null;
  protected currentVe:      Vehicle = Incidence.newNull();

  constructor(
    protected vehicleService: VehicleService,
    protected dateService: NbDateService<Date>,
    protected source: VehicleTableServerDataSource,
  ) {
    this.today = this.dateService.today();
    this.refreshTable();
  }

  refreshTable(): void {
    this.source.refresh();
  }

  onSubmit(event) {
    this.form2table();
    this.onButtonCancel(null);
  }

  onButtonCancel(event) {
    this.currentVeEdit = null;
    this.currentVe = Incidence.newNull();
  }

  form2table() {
    if (this.currentVeEdit) {
      this.vehicleService.patch(this.currentVe).subscribe(
        res => { this.refreshTable(); }
      );
    }else{
      this.vehicleService.create(this.currentVe).subscribe(
        res => { this.refreshTable(); }
      );
    }
  }

  table2form(tabledata: any) {
    if (typeof tabledata.dateStart === 'string') {
      tabledata.dateStart = this.dateService.parse(tabledata.dateStart, this.DATEFORMAT);
      tabledata.dateEnd = this.dateService.parse(tabledata.dateEnd, this.DATEFORMAT);
    }
    this.currentVeEdit = tabledata;
    this.currentVe = tabledata;
  }

  onDelete(event): void {
    if (window.confirm('Deseas eliminar el vehículo?')) {
      //this.incidenceService.delete(event.data);
    }
  }

  onEditTable(event) {
    if(this.currentVeEdit)
      this.onButtonCancel(null);
    this.table2form(event.data);
  }

  settings = {
    mode: 'external',
    hideSubHeader: false,
    noDataMessage: 'Sin incidencias que cumplan los criterios de busqueda',
    pager: {
      display: true,
      perPage: 10, // Items per page
    },
    actions: {
      edit: true,
      delete: true,
      add: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    columns: {
      plate: {
        title: 'Matricula',
        type: 'string',
      },
      brand: {
        title: 'Marca',
        type: 'string',
      },
      model: {
        title: 'Modelo',
        type: 'string',
      },
    },
  };
}