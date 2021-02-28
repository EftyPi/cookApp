import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

    constructor() { }

    @Input() message: string;
    @Output() closeAlert = new EventEmitter<void>();

    ngOnInit(): void {
    }

    onCloseAlert(): void {
        this.closeAlert.emit();
    }
}
