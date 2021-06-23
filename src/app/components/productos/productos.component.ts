import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Producto } from '../../models/producto';
import { ModalDialogService } from '../../services/modal-dialog.service';
import { ProductosService } from '../../services/productos.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  Titulo = 'Productos';
  AccionABMC = 'L';
  TituloAccionABMC = {
    A: '(Alta)',
    L: '(Listado)'
  };
  Mensajes = {
    SD: ' No se encontraron registros...',
    RD: ' Revisar los datos ingresados...'
  };
  Productos: Producto[] = [];
  FormAlta: FormGroup;
  submitted = false;

  constructor(
    public formBuilder: FormBuilder,
    private productoService: ProductosService,
    private modalDialogService: ModalDialogService
  ) {}

  ngOnInit() {
    this.GetProductos();
    this.FormAlta = this.formBuilder.group({
      ProductoID: [0],
      ProductoNombre: ['', [Validators.required, Validators.maxLength(50)]],
      ProductoFechaAlta: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}'
          )
        ]
      ],
      ProductoStock: [
        null,
        [Validators.required, Validators.pattern('^\\d{1,10}$')]
      ]
    });
  }

  GetProductos() {
    this.productoService.get().subscribe({
      next: prod => {
        this.Productos = prod;
      }
    });
  }

  Alta() {
    this.AccionABMC = 'A';
    this.FormAlta.reset();
    this.submitted = false;
  }

  Grabar() {
    this.submitted = true;
    if (this.FormAlta.invalid) {
      return;
    }
    const itemCopy = { ...this.FormAlta.value };

    var arrFecha = itemCopy.ProductoFechaAlta.substr(0, 10).split('/');
    itemCopy.ProductoFechaAlta = new Date(
      arrFecha[2],
      arrFecha[1] - 1,
      arrFecha[0]
    ).toISOString();
    itemCopy.ProductoID = 0;

    this.productoService.post(itemCopy).subscribe((res: any) => {
      this.Cancelar();
      this.modalDialogService.Alert('Registro agregado correctamente.');
    });
  }

  Cancelar() {
    this.AccionABMC = 'L';
    this.GetProductos();
  }
}
