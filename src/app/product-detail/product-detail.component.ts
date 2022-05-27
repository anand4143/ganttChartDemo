import { Component, OnInit, Inject, ViewEncapsulation, Input, ViewChild, ElementRef } from '@angular/core';
import { DatePipe, DOCUMENT } from "@angular/common";
import { TreeNode, DropInfo } from "../../data";
import { debounce } from "@agentepsilon/decko";
import { DataService } from '../service/data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MatCalendar } from '@angular/material/datepicker';
import { ToolbarItems } from '@syncfusion/ej2-angular-treegrid';
import {
    GridComponent, ToolbarService, ExcelExportService, PdfExportService,
    GroupService, ExcelQueryCellInfoEventArgs, PdfQueryCellInfoEventArgs
} from '@syncfusion/ej2-angular-grids';
import { Title } from '@angular/platform-browser';
@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    providers: [ToolbarService, ExcelExportService, PdfExportService, GroupService]
})
export class ProductDetailComponent implements OnInit {
    @ViewChild('TABLE') table: ElementRef;
    exportActive: boolean = false;
    editMode = 0;
    status = false;
    closeResult: any;
    viewRecord: any;
    panelOpenState = false;
    @ViewChild(MatCalendar) _datePicker: MatCalendar<Date>;
    @Input() max: any;
    tomorrow = new Date();
    nextYear = new Date();
    goalId: any;
    startagyId: any;
    selectedFile?: FileList;
    buttonText = "Create";
    headingText = "Create Goal";
    taticHeading = "Create Tactic";
    tacticButton = "Create";
    objectiveHeading = "Create Objective";
    objectiveButton = "Create";
    activityHeading = "Create Key Activity";
    activityButton = "Create";
    startagyHeading = "Create Startagy";
    startagyButton = "Create";
    statusList = [{
        title: "Not Started",
    },
    {
        title: "Started",
    }, {
        title: "Delayed",
    },
    {
        title: "At Risk",
    },
    {
        title: "Completed",
    }]
    public data: Object[];

    public pageSettings: Object;
    public isInitial: Boolean = true;
    @ViewChild('grid')
    public grid: GridComponent;
    workSteamRecord: any;
    strategyForm: FormGroup;
    objecativeForm: FormGroup;
    tacticsForm: FormGroup;
    activityForm: FormGroup;
    nodes: TreeNode[] = [];
    id: any;
    projectId: any;
    deleteHeading: any;
    deleteId: any;
    dropTargetIds = [];
    nodeLookup = {};
    dropActionTodo: DropInfo = null;
    errMessage: any;
    employeeError: any;
    goalRecord: any;
    employeeList: any;
    projectRecord: any;
    submitted: any;
    objectiveId: any;
    valueFromChild: string;
    list = [];
    results = [];
    strategyList = [];
    strategyresult = [];
    tacticList = [];
    tacticsResults = [];
    activityList = [];
    activityResult = [];
    objective = [];
    objectiveResult = [];
    goalFrom: FormGroup;
    deleteForm: FormGroup;
    public idx = '';
    chnageForm: FormGroup;
    prevIndex = 0;
    currIndex = 0;
    urls: any;
    validateDrop = false;
    oldNode: any;
    opened = false;
    name: any;
    permissions: any;
    productPermisssion: any;
    goalPermission: any;
    startgyPermission: any;
    tacticPermission: any;
    activityPermission: any;
    objectivePermission: any;
    downloadPermission: any;
    html = false;
    public toolbar: string[];
    public toolbarOptions: ToolbarItems[];
    dependecyList1: any;
    fileType: any;
    goalFileName: any;
    objectiveFileName: any;
    strategyFileName: any;
    tacticsFileName: any;
    activityFileName: any;
    excel = [];
    constructor(@Inject(DOCUMENT) private document: Document, private datePipe: DatePipe, private toaster: ToastrService,
        private route: ActivatedRoute, private dataService: DataService, private fb: FormBuilder, private modelService: NgbModal, private titleService: Title) {
        this.dataService.resetHome(false);
        let title = localStorage.getItem('domain');
        this.titleService.setTitle(title)
        let obj = localStorage.getItem('menuStatus');
        if (obj == 'true') {
            this.status = true
            this.opened = true
        }
        else {
            this.opened = false
            this.status = false
        }
        this.route.params.subscribe(params => {
            this.projectId = params.id;
        });
        if (!this.projectId) {
            this.projectId = localStorage.getItem('projectId');
        }
        this.goalFrom = this.fb.group({
            name: ['', [Validators.required]],
            status: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            description: [''],
            assignTo: '',
            workStreamId: ['', [Validators.required]],
        })
        this.objecativeForm = this.fb.group({
            name: ['', [Validators.required]],
            status: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            description: [''],
            goalId: [''],
            assignBy: [''],
            assignTo: ['']
        })
        this.strategyForm = this.fb.group({
            name: ['', [Validators.required]],
            status: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            description: [''],
            dependency: [''],
            goalsId: [''],
            assignTo: [''],
            objectiveId: [''],
            assignBy: [''],
        })
        this.tacticsForm = this.fb.group({
            name: ['', [Validators.required]],
            status: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            description: [''],
            dependency: [''],
            goalsId: [''],
            objecativeId: [''],
            strategyId: [''],
            assignBy: [''],
            assignTo: ['']
        })
        this.activityForm = this.fb.group({
            name: ['', [Validators.required]],
            status: ['', [Validators.required]],
            startDate: ['', [Validators.required]],
            endDate: ['', [Validators.required]],
            description: [''],
            dependency: [''],
            goalsId: [''],
            objectiveId: [''],
            strategyId: [''],
            tacticsId: [''],
            assignBy: [''],
            assignTo: ['']
        })
        this.deleteForm = this.fb.group({
            name: ['', [Validators.required]],
        })
        this.chnageForm = this.fb.group({
            endDate: ['', [Validators.required]],
        })

        this.dataService.employeeList().subscribe(data => {
            if (data.status == 200) {
                this.employeeList = data.data
            }
            if (data.status == 404) {
                this.toaster.error('No Empolyee Record Found');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
        this.dataService.getProject(this.projectId).subscribe(data => {
            if (data.status == 200) {
                this.projectRecord = data.data;
                this.name = this.projectRecord[0].projectName;
                this.workSteamRecord = this.projectRecord[0].workStream;
            }
            if (data.status == 404) {
                //  this.toaster.error('No Record Found')
                this.employeeError = "No Record Found!";
            }
            if (data.status == 500) {
                this.employeeError = " Unable To Process, please try again later";
            }
        })
        this.goalList();

        this.dataService.myPermisssion().subscribe(results => {
            if (results.status == 200) {
                this.permissions = results.data;
                this.permissions.forEach(element => {

                    if (element.permission.actionUrl == 'products') {
                        this.productPermisssion = element;
                    }
                    if (element.permission.actionUrl == 'goal') {

                        this.goalPermission = element;
                    }
                    if (element.permission.actionUrl == 'tactic') {
                        this.tacticPermission = element;
                    }
                    if (element.permission.actionUrl == 'strategy') {
                        this.startgyPermission = element;
                    }
                    if (element.permission.actionUrl == 'objective') {
                        this.objectivePermission = element;
                    }
                    if (element.permission.actionUrl == 'activity') {
                        this.activityPermission = element;
                    }
                    if (element.permission.actionUrl == 'product-detail/export-excel') {
                        this.downloadPermission = element;
                    }
                });
            }
            if (results.status == 404) {
                this.productPermisssion = results.data;
            }
        })
    }

    goalList() {
        this.dataService.setLoading3(true);
        this.dataService.getTaskList(this.projectId, this.workStreamId).subscribe(data => {
            if (data.status == 200) {
                this.nodes = data.data;

                this.data = this.nodes;
                this.validateDrop = true;
                this.prepareDragDrop(this.nodes);
                this.dataService.resetLoading3(false);

            }
            if (data.status == 404) {
                this.nodes = []
                this.dataService.resetLoading3(false);
                this.errMessage = "Start adding your first goal by clicking on “Add New Goal” button";
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }
    prepareDragDrop(nodes: TreeNode[]) {
        nodes.forEach(node => {

            this.dropTargetIds.push(node.name);
            this.nodeLookup[node.id] = node;
            this.prepareDragDrop(node.children);
        });

    }

    @debounce(50)
    dragMoved(event) {
        let e = this.document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);

        if (!e) {
            this.clearDragInfo();
            return;
        }
        let container = e.classList.contains("node-item") ? e : e.closest(".node-item");
        if (!container) {
            this.clearDragInfo();
            return;
        }
        this.dropActionTodo = {
            targetId: container.getAttribute("data-id")
        };
        const targetRect = container.getBoundingClientRect();
        const oneThird = targetRect.height / 3;

        if (event.pointerPosition.y - targetRect.top < oneThird) {
            // before
            this.dropActionTodo["action"] = "before";
        } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
            // after
            this.dropActionTodo["action"] = "after";
        } else {
            // inside
            this.dropActionTodo["action"] = "inside";
        }
        this.showDragInfo();
    }
    nodeName: any;
    mouseUp(e) {
        this.nodeName = e.target.nodeName
    }
    objectiveType: any;
    drop(event: any) {
        if (this.nodeName == "MAT-ICON") {
            return
        }
        else {
            this.objectiveType = event.previousContainer.data[event.previousIndex]
            if (!this.dropActionTodo) return;
            const draggedItemId = event.item.data.id;
            const parentItemId = event.previousContainer.id;
            const targetListId = this.getParentNodeId(this.dropActionTodo.targetId, this.nodes, 'main');
            const draggedItem = this.nodeLookup[draggedItemId];
            const oldItemContainer = parentItemId != 'main' ? this.nodeLookup[parentItemId].children : this.nodes;
            const newContainer = targetListId != 'main' ? this.nodeLookup[targetListId].children : this.nodes;
            if (oldItemContainer === newContainer) {
                let i = oldItemContainer.findIndex(c => c.id === draggedItemId);
                oldItemContainer.splice(i, 1);
                switch (this.dropActionTodo.action) {
                    case 'before':
                    case 'after':
                        let targetIndex = 0;
                        targetIndex = newContainer.findIndex(x => JSON.stringify(x.id) === this.dropActionTodo.targetId);
                        if (this.dropActionTodo.action == 'before') {
                            newContainer.splice(targetIndex, 0, draggedItem);
                        } else {
                            newContainer.splice(targetIndex + 1, 0, draggedItem);
                        }
                        break;
                    case 'inside':
                        this.nodeLookup[this.dropActionTodo.targetId].children.push(draggedItem)
                        this.nodeLookup[this.dropActionTodo.targetId].isExpanded = true;
                        break;
                }
                if (this.objectiveType.type == "Key Activity") {
                    this.dataService.setLoading1(true);
                    this.dataService.updateActivitys(event.previousContainer.data).subscribe(data => {
                        if (data.status == 200) {
                            this.toaster.success('Updated Successfully');
                            this.dataService.resetLoading1(false);
                        }
                        else if (data.status == 304) {
                            this.toaster.error('Not Mofidify');
                        }
                        else if (data.status == 500) {
                            this.toaster.error(' Unable To Process, please try again later');
                        }
                    })
                }
                if (this.objectiveType.type == 'Strategy') {
                    this.dataService.setLoading1(true);
                    this.dataService.updateStrategys(event.previousContainer.data).subscribe(data => {
                        if (data.status == 200) {
                            this.toaster.success('Updated Successfully');
                            this.dataService.resetLoading1(false);
                        }
                        else if (data.status == 304) {
                            this.toaster.error('Not Modify');
                        }
                        else if (data.status == 500) {
                            this.toaster.error(' Unable To Process, please try again later');
                        }
                    })
                }
                if (this.objectiveType.type == 'Goal') {
                    this.dataService.setLoading1(true);
                    this.dataService.updateGoals(event.previousContainer.data).subscribe(data => {
                        if (data.status == 200) {
                            this.toaster.success('Updated Successfully');
                            this.dataService.resetLoading1(false);
                        }
                        else if (data.status == 304) {
                            this.toaster.error('Not Mofidify');
                        }
                        else if (data.status == 500) {
                            this.toaster.error(' Unable To Process, please try again later');
                        }
                    })
                }
                if (this.objectiveType.type == 'Tactic') {
                    this.dataService.setLoading1(true);
                    this.dataService.updateTactic(event.previousContainer.data).subscribe(data => {
                        if (data.status == 200) {
                            this.toaster.success('Updated Successfully');
                            this.dataService.resetLoading1(false);
                        }
                        else if (data.status == 304) {
                            this.toaster.error('Not Modify');
                        }
                        else if (data.status == 500) {
                            this.toaster.error(' Unable To Process, please try again later, please try again later');
                        }
                    })
                }

                if (this.objectiveType.type == 'objective') {
                    this.dataService.setLoading1(true);
                    this.dataService.updateObjectives(event.previousContainer.data).subscribe(data => {
                        if (data.status == 200) {
                            this.dataService.resetLoading1(false);
                            this.toaster.success('Updated Successfully');
                        }
                        else if (data.status == 304) {
                            this.toaster.error('Not Mofidify');
                        }
                        else if (data.status == 500) {
                            this.toaster.error(' Unable To Process, please try again later, please try again later');
                        }
                    })
                }
                this.clearDragInfo(true);
            }
            else if (newContainer != oldItemContainer) {
                // Strategies
                // Key Activities
                if (newContainer[0].type == 'Key Activity') {
                    this.toaster.error("Key Activities can only be swapped among Key Activities");
                }
                else if (newContainer[0].type == 'Strategy') {
                    this.toaster.error("Strategies can only be swapped among Strategies");
                }
                else {
                    this.toaster.error(oldItemContainer[0].type + "s can only be swapped among " + oldItemContainer[0].type + "s");
                }
            }
        }

    }

    getParentNodeId(id: string, nodesToSearch: TreeNode[], parentId: string): string {
        for (let node of nodesToSearch) {
            if (node.id == id) return parentId;
            let ret = this.getParentNodeId(id, node.children, node.id);
            if (ret) return ret;
        }
        return null;
    }
    showDragInfo() {
        this.clearDragInfo();
        if (this.dropActionTodo) {
            this.document.getElementById("node-" + this.dropActionTodo.targetId).classList.add("drop-" + this.dropActionTodo.action);
        }
    }
    clearDragInfo(dropped = false) {
        if (dropped) {
            this.dropActionTodo = null;
        }
        this.document
            .querySelectorAll(".drop-before")
            .forEach(element => element.classList.remove("drop-before"));
        this.document
            .querySelectorAll(".drop-after")
            .forEach(element => element.classList.remove("drop-after"));
        this.document
            .querySelectorAll(".drop-inside")
            .forEach(element => element.classList.remove("drop-inside"));
    }

    ngOnInit(): void {

        this.toolbar = ['ExcelExport'];
    }

    getGoal(e: any) {
        this.projectId = e;
    }
    //get objective 
    getObjective(e: any) {
        this.objectiveId = e;
        this.dataService.passValue(e);
    }
    startgyId: any;
    tacticId: any;
    keyId: any;
    getStratgy(e: any) {
        this.startgyId = e;
        this.dataService.passValue(e);
    }
    getTactics(e: any) {

        this.dataService.passValue(e);
    }
    getKeyActivity(e: any) {
        this.keyId = e;
        this.dataService.passValue(e);
    }
    readOutputValueEmitted(val) {
        this.valueFromChild = val;
        this.goalList();
    }

    //delete goal
    deleteGoal(id: any) {
        this.dataService.setLoading2(true);
        this.dataService.deleteGoal(id).subscribe(data => {
            if (data.status == 200) {
                this.goalList();
                this.toaster.success('Goal Deleted Successfully');
                this.dataService.resetLoading2(false);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }
    //delete strategy
    deleteStrategy(id: any) {
        this.dataService.setLoading2(true);
        this.dataService.deleteStrategy(id).subscribe(data => {
            if (data.status == 200) {
                this.goalList();
                this.toaster.success('Strategy Deleted Successfully ');
                this.dataService.resetLoading2(false);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }
    //delte tactics
    deleteTactic(id: any) {
        this.dataService.setLoading2(true);
        this.dataService.deleteTactics(id).subscribe(data => {
            if (data.status == 200) {
                this.goalList();
                this.toaster.success('Tactic Deleted Successfully');
                this.dataService.resetLoading2(false);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }
    //delete tactics
    deleteObjective(id: any) {
        this.dataService.setLoading2(true);
        this.dataService.deleteObjective(id).subscribe(data => {
            if (data.status == 200) {
                this.goalList();
                this.toaster.success('Objective Deleted Successfully');
                this.dataService.resetLoading2(false);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }
    //delete activity
    deleteActivity(id: any) {
        this.dataService.setLoading2(true);
        this.dataService.deleteActivity(id).subscribe(data => {
            if (data.status == 200) {
                this.goalList();
                this.toaster.success('Activity Deleted Successfully');
                this.dataService.resetLoading2(false);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }

    get f() {
        return this.goalFrom.controls;

    }
    get f1() {
        return this.objecativeForm.controls;
    }

    onSubmit() {
        if (this.id > 0) {
            this.updateGoal();
        }
        else {

            this.submitted = true;
            if (this.goalFrom.invalid) {
                // //console.table(this.goalFrom.value);
                return
            }
            if (this.goalFrom.valid) {
                // //console.table(this.goalFrom.value);
            }
            this.dataService.setLoading3(true);
            this.dataService.createGoals({
                projectId: this.projectId,
                name: this.goalFrom.value.name,
                status: this.goalFrom.value.status,
                startDate: this.goalFrom.value.startDate,
                endDate: this.goalFrom.value.endDate,
                description: this.goalFrom.value.description,
                assignBy: parseInt(this.goalFrom.value.assignTo),
                workStreamId: this.goalFrom.value.workStreamId
            }).subscribe(data => {
                if (data.status == 200) {
                    this.modelService.dismissAll();
                    this.goalList();
                    this.goalFrom.reset();
                    this.submitted = false
                    this.toaster.success('Goal Created Successfully');
                    this.dataService.resetLoading3(true);
                    if (this.selectedFile?.length == 1) {
                        this.dataService.fileUplaodProduct({
                            projectId: data.id,
                            taskType: this.fileType
                        }, this.selectedFile.item(0)).subscribe((results: any) => {
                            if (results.status == 200) {

                                this.toaster.success('File Uploaded Successfully');
                            }
                            if (results.status == 404) {
                                this.toaster.success('Please check file format');
                            }
                            if (results.status == 405) {
                                this.toaster.success('Please check file format');
                            }
                            if (results.status == 500) {
                                this.toaster.success(' Unable To Process, please try again later');
                            }
                        })
                    }

                }
                if (data.status == 404) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                if (data.status == 208) {
                    this.toaster.error('Goal Already Exist!');
                }
                if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }

    }
    assignEvent(e: any, value: any) {
        this.goalFrom.value.assignTo
    }
    updateGoal() {

        this.submitted = true;
        if (this.goalFrom.invalid) {
            return
        }
        if (this.goalFrom.valid) {
        }

        this.dataService.setLoading3(true);
        this.dataService.updateGoal(this.id, {
            projectId: this.projectId,
            name: this.goalFrom.value.name,
            status: this.goalFrom.value.status,
            startDate: this.goalFrom.value.startDate,
            endDate: this.goalFrom.value.endDate,
            workStreamId: this.goalFrom.value.workStreamId,
            description: this.goalFrom.value.description,
            assignTo: this.goalFrom.value.assignTo
        }).subscribe(data => {
            if (data.status == 200) {
                this.modelService.dismissAll();
                this.goalFrom.reset();
                this.goalList();
                this.toaster.success('Updated Successfully');
                this.dataService.resetLoading3(false);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }

    openSm(content, element, type: number) {
        this.viewRecord = element.goal;
        this.submitted = false;
        if (type === 1) {
            if (this.goalPermission.update == true) {
                this.id = element.ids
                this.status = false
                this.editMode = 1;
                this.buttonText = "Update";
                this.headingText = "Update Goal";
                this.goalFrom.patchValue({
                    name: "" + element.name,
                    status: "" + element.status,
                    startDate: "" + element.startDate,
                    endDate: "" + element.endDate,
                    description: "" + element.description,
                    assignTo: "" + element.assignBy,
                    workStreamId: "" + element.workStreamId,
                })
                this.goalFrom.get('startDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.startDate), 'yyyy/MM/dd')));
                this.goalFrom.get('endDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.endDate), 'yyyy/MM/dd')));
                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }

        }
        else if (type === 2) {
            if (this.goalPermission.view == true) {
                this.status = false
                this.editMode = 2;
                this.headingText = "View Goal";
                this.goalFrom.patchValue({
                    name: "" + element.name,
                    status: "" + element.status,
                    startDate: "" + element.startDate,
                    endDate: "" + element.endDate,
                    description: "" + element.description,
                    assignTo: "" + element.assignTo
                })
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        } else if (type === 0) {
            if (this.goalPermission.insert == true) {
                this.status = true;
                this.editMode = 0;
                this.headingText = "Create Goal";
                this.buttonText = "Create";
                this.goalFrom.patchValue({
                    name: "",
                    status: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    assignTo: ""
                })
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }

        }

        // this.id = element.id;

    }

    open(content) {
        this.modelService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
            this.closeResult = `Closed with: ${result}`;
        }, (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        });
    }
    private getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    openObjective(content, element, type: number) {
        this.submitted = false;
        if (type === 1) {
            if (this.objectivePermission.update == true) {
                this.status = false
                this.editMode = 1;
                this.id = element.ids;
                this.goalId = element.goalsId;
                this.objectiveButton = "Update";
                this.objectiveHeading = "Update Objective";
                this.objecativeForm.patchValue({
                    name: "" + element.name,
                    status: "" + element.status,
                    description: "" + element.description,
                    assignTo: "" + element.assignBy,
                    goalsId: "" + element.goalsId,
                })
                this.objecativeForm.get('startDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.startDate), 'yyyy/MM/dd')));
                this.objecativeForm.get('endDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.endDate), 'yyyy/MM/dd')));
                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (type === 2) {
            if (this.objectivePermission.view == true) {
                this.status = false
                this.editMode = 2;
                this.goalId = element.goalsId;
                this.objectiveHeading = "View Objective";
                this.objecativeForm.patchValue({
                    name: "" + element.name,
                    status: "" + element.status,
                    startDate: "" + element.startDate,
                    endDate: "" + element.endDate,
                    description: "" + element.description,
                    assignTo: "" + element.assignTo,
                    goalsId: "" + element.goalsId,
                    assignBy: "" + element.assignBy
                })
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }

        } else if (type === 0) {
            if (this.objectivePermission.insert == true) {
                this.status = true;
                this.editMode = 0;
                this.objectiveHeading = "Create Objective"
                this.objectiveButton = "Create"
                this.goalFrom.patchValue({
                    name: "",
                    status: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    assignTo: "",
                    goalsId: "",
                    assignBy: ""
                })
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }

            this.goalId = element.ids;
        }
    }
    // add Objevtive 
    addObjective() {
        if (this.editMode == 1) {
            this.updateObjective()
        }
        if (this.editMode == 0) {
            this.submitted = true;
            if (this.objecativeForm.invalid) {
                return
            }
            if (this.objecativeForm.valid) {
                // //console.table(this.objecativeForm.value);
            }
            this.dataService.setLoading3(true);
            this.dataService.createObjective({
                name: this.objecativeForm.value.name,
                status: this.objecativeForm.value.status,
                startDate: this.objecativeForm.value.startDate,
                endDate: this.objecativeForm.value.endDate,
                description: this.objecativeForm.value.description,
                assignBy: this.objecativeForm.value.assignTo,
                projectId: this.projectId,
                goalsId: this.goalId
            }).subscribe(data => {
                if (data.status == 200) {
                    this.dataService.updateGoal(this.goalId, { isExpanded: true }).subscribe(data => {
                        this.goalList();
                    })
                    this.toaster.success('Objective Created Successfully');
                    this.objecativeForm.reset();
                    this.modelService.dismissAll();
                    this.submitted = false;
                    this.dataService.resetLoading3(false);
                    if (this.selectedFile?.length == 1) {
                        this.dataService.productFIleUpload({
                            projectId: data.id,
                            taskType: this.fileType
                        }, this.selectedFile.item(0)).subscribe(datas => {
                            this.urls = datas;
                            if (this.urls.status == 200) {
                                this.toaster.success('File Uploaded Successfully');
                            }
                            if (this.urls.status == 404) {
                                this.toaster.success('Please check file format');
                            }
                            if (this.urls.status == 500) {
                                this.toaster.success(' Unable To Process, please try again later');
                            }
                        })
                    }
                }
                if (data.status == 208) {
                    this.toaster.error('Objecative Already Exits');
                }
                if (data.status == 404) {
                    this.toaster.error('Req Body Is Empty');
                }
                if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }

    }
    updateObjective() {
        this.submitted = true;
        // this.close = false;
        if (this.objecativeForm.invalid) {
            return
        }
        if (this.objecativeForm.valid) {

        }
        this.dataService.setLoading3(true);
        this.dataService.updateObjective(this.id, {
            name: this.objecativeForm.value.name,
            status: this.objecativeForm.value.status,
            startDate: this.objecativeForm.value.startDate,
            endDate: this.objecativeForm.value.endDate,
            description: this.objecativeForm.value.description,
            assignBy: this.objecativeForm.value.assignTo,
            goalsId: this.goalId,
            projectId: this.projectId,
        }).subscribe(data => {
            if (data.status == 200) {
                this.objecativeForm.reset();
                this.modelService.dismissAll();
                this.goalList();
                this.submitted = false;
                this.toaster.success('Updated Successfully');
                this.dataService.resetLoading3(false);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }
    //stratagy model now
    dependecyList: any
    openStratagy(content, element, type: number) {
        this.submitted = false;
        if (type === 1) {
            this.objectiveId = element.objectiveId;
            this.dataService.goalList(this.objectiveId).subscribe(data => {
                if (data.status == 200) {
                    this.dependecyList = data.data;
                }
            })
            this.dataService.goalList(this.objectiveId).subscribe(data => {
                if (data.status == 200) {
                    this.dependecyList = data.data;
                }
            })
            if (this.startgyPermission.update == true) {
                this.id = element.ids;
                this.status = false
                this.editMode = 1;
                let pDepend = element.pDepend.replace('O', '')
                this.startagyButton = "Update";
                this.startagyHeading = "Update Strategy";
                this.goalId = element.goalsId;
                this.objectiveId = element.objectiveId;
                this.strategyForm.patchValue({
                    name: "" + element.name,
                    status: "" + element.status,
                    description: "" + element.description,
                    startDate: "" + element.startDate,
                    assignTo: "" + element.assignBy,
                    dependency: parseInt(pDepend),
                    goalsId: "" + element.goalsId,
                    objectiveId: "" + element.objectiveId
                });
                this.strategyForm.get('startDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.startDate), 'yyyy/MM/dd')));
                this.strategyForm.get('endDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.endDate), 'yyyy/MM/dd')));
                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (type === 2) {
            if (this.startgyPermission.view == true) {
                this.status = false
                this.editMode = 2;
                this.startagyHeading = "View Strategy";
                this.goalId = element.goalsId;
                this.objectiveId = element.objectiveId;
                this.strategyForm.patchValue({
                    name: "" + element.startagy.name,
                    status: "" + element.startagy.status,
                    description: "" + element.startagy.description,
                    startDate: "" + element.startagy.startDate,
                    assignTo: "" + element.startagy.assignBy,
                    dependency: "" + parseInt(element.startagy.dependency),
                    goalsId: "" + element.startagy.goalsId,
                    objectiveId: "" + element.startagy.objectiveId
                })
                this.strategyForm.get('startDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.startDate), 'yyyy/MM/dd')));
                this.strategyForm.get('endDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.endDate), 'yyyy/MM/dd')));

                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        } else if (type == 0) {
            this.objectiveId = element.ids;
            this.dataService.goalList(this.objectiveId).subscribe(data => {
                if (data.status == 200) {
                    this.dependecyList = data.data;
                }
            })
            if (this.startgyPermission.insert == true) {
                this.status = true;
                this.editMode = 0;
                this.startagyHeading = "Create Strategy";
                this.startagyButton = "Create";
                this.strategyForm.patchValue({
                    name: "",
                    status: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    assignTo: "",
                    dependency: "",
                    goalsId: "",
                    assignBy: ""
                })
                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
            this.goalId = element.goalsId;
            this.objectiveId = element.ids
        }
    }
    get f2() {
        return this.strategyForm.controls;
    }
    addStratagy() {
        if (this.editMode == 1) {
            this.updateStrategy()
        }
        else if (this.editMode == 0) {

            this.submitted = true;
            if (this.strategyForm.invalid) {
                // //console.table(this.strategyForm.value);
                return
            }
            if (this.strategyForm.valid) {
                // //console.table(this.strategyForm.value);
            }
            this.dataService.setLoading3(true);
            this.dataService.createStrategy({
                name: this.strategyForm.value.name,
                status: this.strategyForm.value.status,
                description: this.strategyForm.value.description,
                startDate: this.strategyForm.value.startDate,
                endDate: this.strategyForm.value.endDate,
                dependency: this.strategyForm.value.dependency,
                goalsId: this.goalId,
                projectId: this.projectId,
                objectiveId: this.objectiveId,
                assignBy: parseInt(this.strategyForm.value.assignTo)
            }).subscribe(data => {
                if (data.status == 200) {
                    this.modelService.dismissAll();
                    this.dataService.updateObjective(this.objectiveId, { isExpanded: true }).subscribe(data => {
                        this.goalList();
                    })
                    this.toaster.success('Strategy Created Successfully');
                    this.strategyForm.reset();
                    this.submitted = false;
                    this.dataService.resetLoading3(false);
                    if (this.selectedFile?.length == 1) {
                        this.dataService.productFIleUpload({
                            projectId: data.id,
                            taskType: this.fileType
                        }, this.selectedFile.item(0)).subscribe(datas => {
                            this.urls = datas;
                            if (this.urls.status == 200) {
                                this.toaster.success('File Uploaded Successfully');
                            }
                            if (this.urls.status == 404) {
                                this.toaster.success('Please check file format');
                            }
                            if (this.urls.status == 500) {
                                this.toaster.success(' Unable To Process, please try again later');
                            }
                        })
                    }
                }
                if (data.status == 208) {
                    this.toaster.error('Strategy Already Exits');
                }
                if (data.status == 404) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }

    }
    updateStrategy() {

        this.submitted = true;
        if (this.strategyForm.invalid) {
            // //console.table(this.strategyForm.value);
            return
        }
        if (this.strategyForm.valid) {
            // //console.table(this.strategyForm.value);
        }
        this.dataService.setLoading3(true);
        this.dataService.updateStrategy(this.id, {
            name: this.strategyForm.value.name,
            status: this.strategyForm.value.status,
            description: this.strategyForm.value.description,
            startDate: this.strategyForm.value.startDate,
            endDate: this.strategyForm.value.endDate,
            dependency: this.strategyForm.value.dependency,
            goalsId: this.strategyForm.value.goalsId,
            objecativeId: this.strategyForm.value.objecativeId,
            assignBy: this.strategyForm.value.assignTo,
            projectId: this.projectId,
        }).subscribe(data => {
            if (data.status == 200) {
                this.toaster.success('Updated Successfully');
                this.modelService.dismissAll();
                this.goalList();
                this.strategyForm.reset();
                this.submitted = false;
                this.dataService.resetLoading3(false);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }
    //tactic add

    openTactic(content, element, type: number) {
        this.submitted = false;
        this.goalId = element.goalsId;

        if (type === 1) {
            this.startagyId = element.strategyId;
            this.dataService.strategyList(this.startagyId).subscribe(data => {
                if (data.status == 200) {
                    this.dependecyList1 = data.data;
                }
            })
            if (this.tacticPermission.update == true) {
                this.status = false
                this.editMode = 1;
                this.id = element.ids;
                this.tacticButton = "Update";
                this.taticHeading = "Update Tactic";
                this.goalId = element.goalsId;
                this.objectiveId = element.objectiveId;
                this.startagyId = element.startagyId;
                let pDepend = element.pDepend.replace('T', '')
                this.tacticsForm.patchValue({
                    name: "" + element.name,
                    status: "" + element.status,
                    startDate: "" + element.startDate,
                    endDate: "" + element.endDate,
                    description: "" + element.description,
                    dependency: "" + pDepend,
                    assignTo: "" + element.assignBy,
                    goalsId: "" + element.goalsId,
                    objectiveId: "" + element.objectiveId
                });
                this.tacticsForm.get('startDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.startDate), 'yyyy/MM/dd')));
                this.tacticsForm.get('endDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.endDate), 'yyyy/MM/dd')));
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }

        }
        else if (type === 2) {
            this.startagyId = element.strategyId;
            this.dataService.strategyList(this.startagyId).subscribe(data => {
                if (data.status == 200) {
                    this.dependecyList1 = data.data;
                }
            })
            if (this.tacticPermission.view == true) {
                this.status = false
                this.editMode = 2;
                this.headingText = "View Tactic";
                this.goalId = element.goalsId;
                this.objectiveId = element.objectiveId;
                this.startagyId = element.startagyId;
                this.tacticsForm.patchValue({
                    name: "" + element.name,
                    status: "" + element.status,
                    startDate: "" + element.startDate,
                    endDate: "" + element.endDate,
                    description: "" + element.description,
                    assignTo: "" + element.assignBy,
                    dependency: "" + element.dependency,
                    goalsId: "" + element.goalsId,
                    objectiveId: "" + element.objectiveId
                })
                this.tacticsForm.get('startDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.startDate), 'yyyy/MM/dd')));
                this.tacticsForm.get('endDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.endDate), 'yyyy/MM/dd')));
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (type === 0) {
            this.startagyId = element.ids;
            this.dataService.strategyList(this.startagyId).subscribe(data => {
                if (data.status == 200) {
                    this.dependecyList1 = data.data;
                }
            })
            if (this.tacticPermission.insert == true) {
                this.status = true;
                this.editMode = 0;
                this.objectiveHeading = "Create Tactic";
                this.objectiveButton = "Create";
                this.tacticsForm.patchValue({
                    name: "",
                    status: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    assignTo: "",
                    goalsId: "",
                    dependency: "",
                    assignBy: "",
                    objecativeId: "",
                    strategyId: ""
                })
                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
            this.goalId = element.goalsId;
            this.objectiveId = element.objectiveId;
            this.startagyId = element.ids;
        }
    }
    updateTactics() {

        this.submitted = false;
        if (this.tacticsForm.invalid) {
            // //console.table(this.tacticsForm.value);
            return
        }
        if (this.tacticsForm.valid) {
            // //console.table(this.tacticsForm.value);
        }
        this.dataService.setLoading3(true);
        this.dataService.updateTactics(this.id, {
            name: this.tacticsForm.value.name,
            status: this.tacticsForm.value.status,
            startDate: this.tacticsForm.value.startDate,
            endDate: this.tacticsForm.value.endDate,
            description: this.tacticsForm.value.description,
            dependency: this.tacticsForm.value.dependency,
            goalsId: this.goalId,
            objectiveId: this.objectiveId,
            strategyId: this.startagyId,
            assignBy: this.tacticsForm.value.assignTo,
            projectId: this.projectId,
        }).subscribe(data => {
            if (data.status == 200) {
                this.submitted = false;
                this.modelService.dismissAll();
                this.tacticsForm.reset();
                this.goalList();
                this.toaster.success('Updated Successfully');
                this.dataService.resetLoading3(false);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }
    get f3() {
        return this.tacticsForm.controls;
    }
    //create Tactics
    addTactic() {
        if (this.editMode == 1) {
            this.updateTactics();
        }
        else {
            this.dataService.setLoading3(true);
            this.submitted = true;
            if (this.tacticsForm.invalid) {
                // //console.table(this.tacticsForm.value);
                return
            }
            if (this.tacticsForm.valid) {
                // //console.table(this.tacticsForm.value);
            }
            this.dataService.createTactics({
                name: this.tacticsForm.value.name,
                status: this.tacticsForm.value.status,
                startDate: this.tacticsForm.value.startDate,
                endDate: this.tacticsForm.value.endDate,
                description: this.tacticsForm.value.description,
                dependency: this.tacticsForm.value.dependency,
                goalsId: this.goalId,
                objectiveId: this.objectiveId,
                strategyId: this.startagyId,
                projectId: this.projectId,
                assignBy: parseInt(this.tacticsForm.value.assignTo)
            }).subscribe(data => {
                if (data.status == 200) {
                    this.submitted = false;
                    this.toaster.success('Tactic Created Successfully');
                    this.modelService.dismissAll();
                    this.tacticsForm.reset();
                    this.dataService.updateStrategy(this.startagyId, { isExpanded: true }).subscribe(data => {
                        this.goalList();
                    })
                    this.dataService.resetLoading3(false);
                    if (this.selectedFile?.length == 1) {
                        this.dataService.productFIleUpload({
                            projectId: data.id,
                            taskType: this.fileType
                        }, this.selectedFile.item(0)).subscribe(results => {
                            this.urls = results;
                            if (this.urls.status == 200) {
                                this.toaster.success('File Uploaded Successfully');
                            }
                            if (this.urls.status == 404) {
                                this.toaster.success('Please check file format and ');
                            }
                            if (this.urls.status == 500) {
                                this.toaster.success(' Unable To Process, please try again later');
                            }
                        })
                    }
                }
                if (data.status == 208) {
                    this.toaster.error('Tactics Already Exits');
                }
                if (data.status == 404) {
                    this.toaster.error('Req Body Is Empty');
                }
                if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }

    }

    updateActivity() {

        this.submitted = true;
        if (this.activityForm.invalid) {
            // //console.table(this.activityForm.value);
            return
        }
        if (this.activityForm.valid) {
            // //console.table(this.activityForm.value);
        }
        this.dataService.setLoading3(true);
        this.dataService.updateActivity(this.id, {
            name: this.activityForm.value.name,
            status: this.activityForm.value.status,
            startDate: this.activityForm.value.startDate,
            description: this.activityForm.value.description,
            endDate: this.activityForm.value.endDate,
            dependency: this.activityForm.value.dependency,
            goalsId: this.goalId,
            projectId: this.projectId,
            objectiveId: this.objectiveId,
            strategyId: this.startagyId,
            tacticsId: this.tacticId,
            assignBy: this.activityForm.value.assignTo,
        }).subscribe(data => {
            if (data.status == 200) {
                this.modelService.dismissAll();
                this.activityForm.reset();
                this.goalList();
                this.toaster.success('Updated Successfully');
                this.dataService.resetLoading3(true);
            }
            if (data.status == 404) {
                this.toaster.error('Please fill all the mandatory fields');
            }
            if (data.status == 500) {
                this.toaster.error(' Unable To Process, please try again later');
            }
        })
    }

    get f4() {
        return this.activityForm.controls;
    }
    dependecyList2: any;
    openActivity(content, element, type: number) {
        this.submitted = false;
        if (type == 0) {
            this.tacticId = element.ids;
            this.dataService.tacticList(this.tacticId).subscribe(data => {
                if (data.status == 200) {
                    this.dependecyList2 = data.data;
                }
            })
        }
        if (type == 1) {
            this.tacticId = element.tacticsId;
            this.dataService.tacticList(this.tacticId).subscribe(data => {
                if (data.status == 200) {
                    this.dependecyList2 = data.data;
                }
            })
        }
        if (type == 2) {
            this.tacticId = element.tacticsId;
            this.dataService.tacticList(this.tacticId).subscribe(data => {
                if (data.status == 200) {
                    this.dependecyList2 = data.data;
                }
            })
        }
        if (type === 1) {
            if (this.activityPermission.update == true) {
                this.status = false
                this.editMode = 1;
                this.activityButton = "Update";
                this.activityHeading = "Update Key Activity";
                this.id = element.ids;
                this.goalId = element.goalsId;
                this.objectiveId = element.objectiveId;
                this.startagyId = element.strategyId;
                this.tacticId = element.tacticId;
                this.activityForm.patchValue({
                    name: "" + element.name,
                    status: "" + element.status,
                    startDate: "" + element.startDate,
                    endDate: "" + element.endDate,
                    description: "" + element.description,
                    assignTo: "" + element.assignBy,
                    goalsId: "" + element.goalsId,
                    dependency: "" + element.dependency,
                    assignBy: "" + element.assignBy,
                    strategyId: "" + element.objectiveId,
                    tacticsId: "" + element.tacticsId,
                })
                this.activityForm.get('startDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.startDate), 'yyyy/MM/dd')));
                this.activityForm.get('endDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.endDate), 'yyyy/MM/dd')));
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (type === 2) {
            if (this.activityPermission.update == true) {
                this.status = false
                this.editMode = 2;
                this.activityHeading = "View Key Activity";
                this.activityForm.patchValue({
                    name: "" + element.activity.name,
                    status: "" + element.activity.status,
                    startDate: "" + element.activity.startDate,
                    endDate: "" + element.activity.endDate,
                    description: "" + element.activity.description,
                    assignTo: "" + element.activity.assignBy,
                    goalsId: "" + element.activity.goalsId,
                    dependency: "" + element.activity.dependency,
                    assignBy: "" + element.activity.assignBy,
                    strategyId: "" + element.activity.objectiveId,
                    tacticsId: "" + element.activity.tacticsId,
                })
                this.activityForm.get('startDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.startDate), 'yyyy/MM/dd')));
                this.activityForm.get('endDate').patchValue(this.formatDate(this.datePipe.transform(new Date(element.endDate), 'yyyy/MM/dd')));
                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }

        } else if (type == 0) {
            if (this.activityPermission.insert == true) {
                this.status = true;
                this.editMode = 0;
                this.activityHeading = "Create Key Activity"
                this.activityButton = "Create"
                this.activityForm.patchValue({
                    name: "",
                    status: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                    assignTo: "",
                    goalsId: "",
                    assignBy: "",
                    dependency: "",
                    objecativeId: "",
                    strategyId: ""
                })
                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
            this.goalId = element.goalsId;
            this.objectiveId = element.objectiveId;
            this.startagyId = element.strategyId;
            this.tacticId = element.ids;
        }



    }
    addActivity() {
        if (this.editMode == 1) {
            this.updateActivity();
        }
        else {

            this.submitted = true;
            if (this.activityForm.invalid) {
                // //console.table(this.activityForm.value);
                return
            }
            if (this.activityForm.valid) {
                // //console.table(this.activityForm.value);
            }
            this.dataService.setLoading3(true);
            this.dataService.createActivity({
                name: this.activityForm.value.name,
                status: this.activityForm.value.status,
                startDate: this.activityForm.value.startDate,
                description: this.activityForm.value.description,
                endDate: this.activityForm.value.endDate,
                dependency: this.activityForm.value.dependency,
                goalsId: this.goalId,
                objectiveId: this.objectiveId,
                strategyId: this.startagyId,
                tacticsId: this.tacticId,
                projectId: this.projectId,
                assignBy: parseInt(this.activityForm.value.assignTo),
            }).subscribe(data => {
                if (data.status == 200) {
                    this.submitted = false;
                    this.modelService.dismissAll();
                    this.toaster.success('Activity Created Successfully');
                    this.dataService.resetLoading3(true);
                    this.dataService.updateTactics(this.tacticId, { isExpanded: true }).subscribe(data => {
                        this.goalList();
                    })
                    if (this.selectedFile?.length == 1) {
                        this.dataService.productFIleUpload({
                            projectId: data.id,
                            taskType: this.fileType
                        }, this.selectedFile.item(0)).subscribe(results => {

                            this.urls = results;
                            if (this.urls.status == 200) {
                                this.toaster.success('File Uploaded Successfully');
                            }
                            if (this.urls.status == 404) {
                                this.toaster.success('Please check file format');
                            }
                            if (this.urls.status == 500) {
                                this.toaster.success(' Unable To Process, please try again later');
                            }
                        })
                    }
                }
                if (data.status == 208) {
                    this.toaster.error('Activity Already Exits');
                }
                if (data.status == 404) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }

    }
    private formatDate(date) {
        const d = new Date(date);
        let month = '' + (d.getMonth() + 1);
        let day = '' + d.getDate();
        const year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '1' + day;
        return [year, month, day].join('-');
    }
    delete() {
        this.chnageForm.patchValue({
            name: ""
        })
        if (this.editMode === 5) {
            this.deleteGoal(this.deleteId);
            this.modelService.dismissAll();
            this.goalList();
        }
        if (this.editMode === 6) {
            this.deleteObjective(this.deleteId);
            this.modelService.dismissAll();
            this.goalList();
        }
        if (this.editMode === 7) {
            this.deleteStrategy(this.deleteId);
            this.modelService.dismissAll();
            this.goalList();
        }
        if (this.editMode === 8) {
            this.deleteTactic(this.deleteId);
            this.modelService.dismissAll();
            this.goalList();
        }
        if (this.editMode === 9) {
            this.deleteActivity(this.deleteId);
            this.modelService.dismissAll();
            this.goalList();
        }
    }
    deleteFromStatus = false
    changeStatus(event: any) {
        this.deleteFromStatus = true
        if (this.deleteForm.value.name === 'DELETE') {
            this.deleteFromStatus = true
        }
        else if (this.deleteForm.value.name) {
            this.deleteFromStatus = false
        }

    }
    //delete dailog box

    openDelete(content, element, type: number) {
        if (type === 5) {
            if (this.goalPermission.delete == true) {
                this.status = false
                this.editMode = 5;
                this.deleteId = element.ids;
                this.deleteHeading = "Delete Goal"
                this.deleteForm.patchValue({
                    name: ""
                })
                this.deleteForm.reset();
                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (type === 6) {
            if (this.objectivePermission.delete == true) {
                this.status = false
                this.editMode = 6;
                this.deleteId = element.ids;
                this.deleteHeading = "Delete Objective"
                this.deleteForm.patchValue({
                    name: ""
                })
                this.deleteForm.reset();
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }

        } else if (type === 7) {
            if (this.startgyPermission.delete == true) {
                this.editMode = 7;
                this.deleteId = element.ids;
                this.deleteHeading = "Delete Strategy"
                this.deleteForm.patchValue({
                    name: ""
                })
                this.deleteForm.reset();
                this.modelService.open(content, { size: 'lg' });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (type === 8) {
            if (this.tacticPermission.delete == true) {
                this.editMode = 8;
                this.deleteId = element.ids;
                this.deleteHeading = "Delete Tactic"
                this.deleteForm.patchValue({
                    name: ""
                })
                this.deleteForm.reset();
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (type === 9) {
            if (this.activityPermission.delete == true) {
                this.editMode = 9;
                this.deleteId = element.ids;
                this.deleteHeading = "Delete key Activity"
                this.deleteForm.patchValue({
                    name: ""
                })
                this.deleteForm.reset();
                this.modelService.open(content, { size: 'lg' });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }

    }
    get f5() {
        return this.deleteForm.controls;
    }
    eventType: any;
    updatePermissionGoal = false;
    updatePermissionObj = false;
    updatePermissionTactic = false;
    updatePermissionStratgy = false;
    updatePermissionKey = false;
    textBoxStatus = true;
    changeDate(e: any, value: any, type: any) {
        if (type === 'goal') {
            if (this.goalPermission.update == true) {
                this.eventType = 'goal'
                this.id = value.ids;
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        if (type === 'objective') {
            if (this.objectivePermission.update == true) {
                this.eventType = 'objective';
                this.id = value.ids;
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        if (type === 'startagy') {
            if (this.startgyPermission.update == true) {
                this.eventType = 'startagy';
                this.id = value.ids;
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        if (type === 'tactic') {
            if (this.tacticPermission.update == true) {
                this.eventType = 'tactic';
                this.id = value.ids;
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        if (type === 'key') {
            if (this.activityPermission.update == true) {
                this.eventType = 'key';
                this.id = value.ids;
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        if (type === 'goalStatus') {
            if (this.goalPermission.update == true) {
                this.eventType = 'goalStatus'
                this.id = value.ids;
                this.updatePermissionGoal = true;
            }
            else {
                this.updatePermissionGoal = false;
                this.toaster.error("you don't have permission to perform this action");
            }
        }

        if (type === 'objectiveStatus') {
            if (this.objectivePermission.update == true) {
                this.eventType = 'objectiveStatus';
                this.id = value.ids;
                this.updatePermissionObj = true;
            } else {
                this.updatePermissionObj = false;
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        if (type === 'startagyStatus') {
            if (this.startgyPermission.update == true) {
                this.eventType = 'startagyStatus';
                this.id = value.ids;
                this.updatePermissionStratgy = true;
            } else {
                this.updatePermissionStratgy = false;
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        if (type === 'tacticStatus') {
            if (this.tacticPermission.update == true) {
                this.eventType = 'tacticStatus';
                this.id = value.ids;
                this.updatePermissionTactic = true;
            } else {
                this.updatePermissionTactic = false;
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        if (type === 'keyStatus') {
            if (this.activityPermission.update == true) {
                this.eventType = 'keyStatus';
                this.id = value.ids;
                this.updatePermissionKey = true;
            }
            else {
                this.updatePermissionKey = false;
                this.toaster.error("you don't have permission to perform this action");
            }
        }
    }

    handleDOBChange(e: any) {
        this.textBoxStatus = false;
        if (this.eventType == 'goal') {
            this.dataService.setLoading3(true);
            this.dataService.updateGoal(this.id, {
                endDate: e.value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.resetLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
        if (this.eventType == 'objective') {
            this.dataService.setLoading3(true);
            this.dataService.updateObjective(this.id, {
                endDate: e.value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.setLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error('Unable To Process, please try again later');
                }
            })
        }
        if (this.eventType == 'startagy') {
            this.dataService.setLoading3(true);
            this.dataService.updateStrategy(this.id, {
                endDate: e.value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.resetLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
        if (this.eventType == 'tactic') {
            this.dataService.setLoading3(true);
            this.dataService.updateTactics(this.id, {
                endDate: e.value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.resetLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
        if (this.eventType == 'key') {
            this.dataService.setLoading3(true);
            this.dataService.updateActivity(this.id, {
                endDate: e.value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.resetLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
    }
    changeProductStatus(e: any, value: any) {
        if (this.eventType === 'goalStatus') {
            this.dataService.setLoading3(true);
            this.dataService.updateGoal(this.id, {
                status: value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.resetLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
        if (this.eventType === 'objectiveStatus') {
            this.dataService.setLoading3(true);
            this.dataService.updateObjective(this.id, {
                status: value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.resetLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
        if (this.eventType === 'startagyStatus') {
            this.dataService.setLoading3(true);
            this.dataService.updateStrategy(this.id, {
                status: value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.resetLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
        if (this.eventType === 'tacticStatus') {
            this.dataService.setLoading3(true);
            this.dataService.updateTactics(this.id, {
                status: value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.resetLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
        if (this.eventType === 'keyStatus') {
            this.dataService.setLoading3(true);
            this.dataService.updateActivity(this.id, {
                status: value
            }).subscribe(data => {
                if (data.status == 200) {
                    this.goalList();
                    this.toaster.success('Updated Successfully');
                    this.dataService.resetLoading3(false);
                }
                else if (data.status == 208) {
                    this.toaster.error('Please fill all the mandatory fields');
                }
                else if (data.status == 304) {
                    this.toaster.error('Invalid input, please try again');
                }
                else if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
    }
    expandNode(ev: any, e: any) {
        if (this.nodes.length > 0) {
            if (ev.target.checked === true) {
                this.nodes.forEach((node: any) => {
                    this.dataService.updateGoal(node.ids, {
                        isExpanded: true
                    }).subscribe(data => {
                        if (data.status == 200) {
                            // this.toaster.success('update successfully')
                        }
                    })
                    node.isExpanded = true;
                    node.children.forEach(element => {
                        this.dataService.updateObjective(element.ids, {
                            isExpanded: true
                        }).subscribe(data => {
                            if (data.status == 200) {
                                // this.toaster.success('update successfully')
                            }
                        })
                        element.isExpanded = true;
                        element.children.forEach(ele => {
                            this.dataService.updateStrategy(ele.ids, {
                                isExpanded: true
                            }).subscribe(data => {
                                if (data.status == 200) {
                                    // this.toaster.success('update successfully')
                                }
                            })
                            ele.isExpanded = true;
                            ele.children.forEach(ele1 => {
                                this.dataService.updateTactics(ele1.ids, {
                                    isExpanded: true
                                }).subscribe(data => {
                                    if (data.status == 200) {
                                        // this.toaster.success('update successfully')
                                    }
                                })
                                ele1.isExpanded = true;
                                ele1.children.forEach(ele2 => {
                                    ele2.isExpanded = true;
                                    this.dataService.updateActivity(ele2.ids, {
                                        isExpanded: true
                                    }).subscribe(data => {
                                        if (data.status == 200) {
                                            // this.toaster.success('update successfully')
                                        }
                                    })
                                })
                            });
                        });
                    });

                });
            }
            else if (ev.target.checked == false) {
                this.nodes.forEach((node: any) => {
                    node.isExpanded = false;
                    this.dataService.updateGoal(node.ids, {
                        isExpanded: false
                    }).subscribe(data => {
                        if (data.status == 200) {
                            // this.toaster.success('update successfully')
                        }
                    })
                    node.children.forEach(element => {
                        this.dataService.updateObjective(element.ids, {
                            isExpanded: false
                        }).subscribe(data => {
                            if (data.status == 200) {
                                // this.toaster.success('update successfully')
                            }
                        })
                        element.isExpanded = false;
                        element.children.forEach(ele => {
                            this.dataService.updateStrategy(element.ids, {
                                isExpanded: false
                            }).subscribe(data => {
                                if (data.status == 200) {
                                    // this.toaster.success('update successfully')
                                }
                            })
                            ele.isExpanded = false;
                            ele.children.forEach(ele1 => {
                                ele1.isExpanded = false;
                                this.dataService.updateTactics(element.ids, {
                                    isExpanded: false
                                }).subscribe(data => {
                                    if (data.status == 200) {
                                        // this.toaster.success('update successfully')
                                    }
                                })
                                ele1.children.forEach(ele2 => {
                                    ele2.isExpanded = false;
                                    this.dataService.updateActivity(element.ids, {
                                        isExpanded: false
                                    }).subscribe(data => {
                                        if (data.status == 200) {
                                            // this.toaster.success('update successfully')
                                        }
                                    })
                                })
                            });
                        });
                    });

                });
            }
        }

    }

    fileUploads(event, value: any) {
        if (event.target.files.length > 0) {
            this.selectedFile = event.target.files;
        }
        if (value == 'goal') {
            this.fileType = "goal";
            this.goalFileName = this.selectedFile[0].name;
        }
        else if (value == 'objective') {
            this.fileType = "objective";
            this.objectiveFileName = this.selectedFile[0].name;
        }
        else if (value == 'strategy') {
            this.fileType = "strategy";
            this.strategyFileName = this.selectedFile[0].name;
        }
        else if (value == 'tactics') {
            this.fileType = "tactics";
            this.tacticsFileName = this.selectedFile[0].name;
        }
        else if (value == 'activity') {
            this.fileType = "activity";
            this.activityFileName = this.selectedFile[0].name;
        }
    }
    expend(value: any) {
    }
    singleList: any;
    view: boolean = false;
    closeBox() {
        this.view = false;
    }
    decisionAction(data: any, task, taskType) {
        let type;
        this.singleList = data;
        if (data.type == 'Goal') {
            if (this.goalPermission.view == true) {
                this.view = true
                type = 'goal';
                this.dataService.setNewUserInfo({
                    projectId: data.ids,
                    type: type,
                    taskType: type
                });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (data.type == 'Objective') {
            if (this.objectivePermission.view == true) {
                this.view = true
                type = 'objective';
                this.dataService.setNewUserInfo({
                    projectId: data.ids,
                    type: type,
                    taskType: type
                });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (data.type == 'Strategy') {
            if (this.startgyPermission.view == true) {
                this.view = true;
                type = 'strategy';
                this.dataService.setNewUserInfo({
                    projectId: data.ids,
                    type: type,
                    taskType: type
                });
            }
            else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (data.type == 'Tactic') {
            if (this.tacticPermission.view == true) {
                this.view = true;
                type = 'tactics';
                this.dataService.setNewUserInfo({
                    projectId: data.ids,
                    type: type,
                    taskType: type
                });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }
        else if (data.type == 'Key Activity') {
            if (this.activityPermission.view == true) {
                this.view = true;
                type = 'activity';
                this.dataService.setNewUserInfo({
                    projectId: data.ids,
                    type: type,
                    taskType: type
                });
            } else {
                this.toaster.error("you don't have permission to perform this action");
            }
        }

    }
    clickEvent() {
        this.status = !this.status;
        localStorage.setItem('menuStatus', this.status.toString());
    }
    workStreamId: any;
    workStreamFilter(event: any) {
        if (this.workStreamId == 'Select WorkStream') {
            this.workStreamId = 'undefined'
        }
        if (this.workStreamId == 'Select All') {
            this.dataService.getTaskList(this.projectId, 'undefined').subscribe(data => {
                if (data.status == 200) {
                    this.nodes = data.data;
                    this.validateDrop = true;
                    this.prepareDragDrop(this.nodes);
                }
                if (data.status == 404) {
                    // this.toaster.error('No Record Found!');
                    this.errMessage = "No Record Found!";
                }
                if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }
        else {
            this.dataService.getTaskList(this.projectId, this.workStreamId).subscribe(data => {
                if (data.status == 200) {
                    this.nodes = data.data;
                    this.validateDrop = true;
                    this.prepareDragDrop(this.nodes);
                }
                if (data.status == 404) {
                    this.nodes = []
                    // this.toaster.error('No Record Found!');
                    this.errMessage = "No Record Found!";
                }
                if (data.status == 500) {
                    this.toaster.error(' Unable To Process, please try again later');
                }
            })
        }

    }
    // create duplicate
    createCopy(Duplcate: any, num: number) {
        if (num === 5) {
            this.dataService.createGoals({
                companyId: Duplcate.companyId,
                description: Duplcate.description,
                startDate: Duplcate.startDate,
                endDate: Duplcate.endDate,
                name: Duplcate.name,
                projectId: Duplcate.projectId,
                status: Duplcate.status,
                type: Duplcate.type,
                workStreamId: Duplcate.workStreamId,
                assignBy: Duplcate.assignBy,
                copy: "duplicate"
            }).subscribe(results => {
                if (results.status == 200) {
                    this.goalList();
                    this.toaster.success('Copy Created Successfully');
                }
                if (results.status == 208) {
                    this.toaster.error('Copy Created Successfully');
                }
                if (results.status == 500) {
                    this.toaster.error('Unable To Proccess');
                }
            })
        }

        //create duplicate objectives
        if (num === 6) {
            this.dataService.createObjective({
                companyId: Duplcate.companyId,
                description: Duplcate.description,
                startDate: Duplcate.startDate,
                endDate: Duplcate.endDate,
                name: Duplcate.name,
                projectId: Duplcate.projectId,
                status: Duplcate.status,
                type: Duplcate.type,
                workStreamId: Duplcate.workStreamId,
                assignBy: Duplcate.assignBy,
                copy: "duplicate",
                goalsId: Duplcate.goalsId
            }).subscribe(resp => {
                if (resp.status == 200) {
                    this.goalList();
                    this.toaster.success('Copy Created Successfully');
                }
                if (resp.status == 208) {
                    this.toaster.error('Copy Created Successfully');
                }
                if (resp.status == 500) {
                    this.toaster.error('Unable To Proccess');
                }
            })
        }
        //create duplicate Strategy
        if (num === 7) {
            this.dataService.createStrategy({
                companyId: Duplcate.companyId,
                description: Duplcate.description,
                startDate: Duplcate.startDate,
                endDate: Duplcate.endDate,
                name: Duplcate.name,
                projectId: Duplcate.projectId,
                status: Duplcate.status,
                type: Duplcate.type,
                dependency: Duplcate.pDepend,
                workStreamId: Duplcate.workStreamId,
                assignBy: Duplcate.assignBy,
                objectiveId: Duplcate.objectiveId,
                copy: "duplicate",
                goalsId: Duplcate.goalsId
            }).subscribe(resp => {
                if (resp.status == 200) {
                    this.goalList();
                    this.toaster.success('Copy Created Successfully');
                }
                if (resp.status == 208) {
                    this.toaster.error('Copy Created Successfully');
                }
                if (resp.status == 500) {
                    this.toaster.error('Unable To Proccess');
                }
            })
        }
        //create duplicate objectives
        if (num === 8) {
            this.dataService.createTactics({
                companyId: Duplcate.companyId,
                description: Duplcate.description,
                startDate: Duplcate.startDate,
                endDate: Duplcate.endDate,
                name: Duplcate.name,
                projectId: Duplcate.projectId,
                status: Duplcate.status,
                type: Duplcate.type,
                workStreamId: Duplcate.workStreamId,
                assignBy: Duplcate.assignBy,
                objectiveId: Duplcate.objectiveId,
                dependency: Duplcate.pDepend,
                copy: "duplicate",
                goalsId: Duplcate.goalsId,
                strategyId: Duplcate.strategyId
            }).subscribe(resp => {
                if (resp.status == 200) {
                    this.goalList();
                    this.toaster.success('Copy Created Successfully');
                }
                if (resp.status == 208) {
                    this.toaster.error('Copy Created Successfully');
                }
                if (resp.status == 500) {
                    this.toaster.error('Unable To Proccess');
                }
            })
        }
        //create duplicate objectives
        if (num === 9) {
            this.dataService.createActivity({
                tacticsId: Duplcate.tacticsId,
                companyId: Duplcate.companyId,
                description: Duplcate.description,
                startDate: Duplcate.startDate,
                endDate: Duplcate.endDate,
                name: Duplcate.name,
                projectId: Duplcate.projectId,
                status: Duplcate.status,
                type: Duplcate.type,
                workStreamId: Duplcate.workStreamId,
                assignBy: Duplcate.assignBy,
                objectiveId: Duplcate.objectiveId,
                dependency: Duplcate.pDepend,
                copy: "duplicate",
                goalsId: Duplcate.goalsId,
                strategyId: Duplcate.strategyId
            }).subscribe(resp => {
                if (resp.status == 200) {
                    this.goalList();
                    this.toaster.success('Copy Created Successfully');
                }
                if (resp.status == 208) {
                    this.toaster.error('Copy Created Successfully');
                }
                if (resp.status == 500) {
                    this.toaster.error('Unable To Proccess');
                }
            })
        }
    }
    //create duplicate all
    createCopyAll(duplicate: any, num: number) {
        if (num === 5) {
            this.dataService.createGoal({
                companyId: duplicate.companyId,
                description: duplicate.description,
                startDate: duplicate.startDate,
                endDate: duplicate.endDate,
                name: duplicate.name,
                projectId: duplicate.projectId,
                status: duplicate.status,
                type: duplicate.type,
                workStreamId: duplicate.workStreamId,
                assignBy: duplicate.assignBy,
                copy: "duplicate"
            }).subscribe(results => {
                if (results.status == 200) {
                    if (duplicate.children.length > 0) {
                        duplicate.children.forEach(element => {
                            this.dataService.createObjective({
                                companyId: element.companyId,
                                description: element.description,
                                startDate: element.startDate,
                                endDate: element.endDate,
                                name: element.name,
                                projectId: element.projectId,
                                status: element.status,
                                type: element.type,
                                workStreamId: element.workStreamId,
                                assignBy: element.assignBy,
                                copy: "duplicate",
                                goalsId: results.id
                            }).subscribe(resp => {
                                if (resp.status == 200) {
                                    if (element.children.length > 0) {
                                        element.children.forEach(ele => {
                                            this.dataService.createStrategy({
                                                companyId: ele.companyId,
                                                description: ele.description,
                                                startDate: ele.startDate,
                                                endDate: ele.endDate,
                                                objectiveId: resp.id,
                                                name: ele.name,
                                                projectId: ele.projectId,
                                                status: ele.status,
                                                type: ele.type,
                                                dependency: ele.pDepend,
                                                workStreamId: element.workStreamId,
                                                assignBy: ele.assignBy,
                                                copy: "duplicate",
                                                goalsId: results.id
                                            }).subscribe(respon => {
                                                if (respon.status == 200) {
                                                    if (ele.children.length > 0) {
                                                        ele.children.forEach(ele1 => {
                                                            this.dataService.createTactics({
                                                                companyId: ele1.companyId,
                                                                description: ele1.description,
                                                                startDate: ele1.startDate,
                                                                endDate: ele1.endDate,
                                                                objectiveId: resp.id,
                                                                name: ele1.name,
                                                                projectId: ele1.projectId,
                                                                status: ele1.status,
                                                                type: ele1.type,
                                                                strategyId: respon.id,
                                                                dependency: ele1.pDepend,
                                                                workStreamId: ele1.workStreamId,
                                                                assignBy: ele1.assignBy,
                                                                copy: "duplicate",
                                                                goalsId: results.id
                                                            }).subscribe(res1 => {
                                                                if (res1.status == 200) {
                                                                    if (ele1.children.length > 0)
                                                                        ele1.children.forEach(el2 => {
                                                                            this.dataService.createActivity({
                                                                                companyId: el2.companyId,
                                                                                description: el2.description,
                                                                                startDate: el2.startDate,
                                                                                endDate: el2.endDate,
                                                                                objectiveId: resp.id,
                                                                                name: el2.name,
                                                                                projectId: el2.projectId,
                                                                                status: el2.status,
                                                                                type: el2.type,
                                                                                tacticsId: res1.id,
                                                                                strategyId: respon.id,
                                                                                dependency: el2.pDepend,
                                                                                workStreamId: el2.workStreamId,
                                                                                assignBy: el2.assignBy,
                                                                                copy: "duplicate",
                                                                                goalsId: results.id
                                                                            }).subscribe(data => {
                                                                                if (data.status == 200) {
                                                                                    this.toaster.success('Copy Created Successfully');
                                                                                    this.goalList();
                                                                                }
                                                                            })
                                                                        })
                                                                }
                                                                else {
                                                                    this.toaster.success('Copy Created Successfully');
                                                                    this.goalList();
                                                                }

                                                            })
                                                        });
                                                    }
                                                }
                                                else {
                                                    this.toaster.success('Copy Created Successfully');
                                                    this.goalList();
                                                }
                                            })
                                        });

                                    }
                                    else {
                                        this.toaster.success('Copy Created Successfully');
                                        this.goalList();
                                    }
                                }
                                if (resp.status == 500) {
                                    this.toaster.error('Unable To Proccess');
                                }
                            })
                        });
                    } else {
                        this.goalList();
                        this.toaster.success('Copy Created Successfully');
                    }
                }
                if (results.status == 500) {
                    this.toaster.error('Unable To Proccess');
                }
            })
        }

        // //create duplicate objectives
        if (num === 6) {
            this.dataService.createObjective({
                companyId: duplicate.companyId,
                description: duplicate.description,
                startDate: duplicate.startDate,
                endDate: duplicate.endDate,
                name: duplicate.name,
                projectId: duplicate.projectId,
                status: duplicate.status,
                type: duplicate.type,
                workStreamId: duplicate.workStreamId,
                assignBy: duplicate.assignBy,
                copy: "duplicate",
                goalsId: duplicate.goalsId
            }).subscribe(resp => {
                if (resp.status == 200) {
                    if (duplicate.children.length > 0) {
                        duplicate.children.forEach(ele => {
                            this.dataService.createStrategy({
                                companyId: ele.companyId,
                                description: ele.description,
                                startDate: ele.startDate,
                                endDate: ele.endDate,
                                objectiveId: resp.id,
                                name: ele.name,
                                projectId: ele.projectId,
                                status: ele.status,
                                dependency: ele.pDepend,
                                type: ele.type,
                                assignBy: ele.assignBy,
                                copy: "duplicate",
                                goalsId: duplicate.goalsId
                            }).subscribe(respon => {
                                if (respon.status == 200) {
                                    if (ele.children.length > 0) {
                                        ele.children.forEach(ele1 => {
                                            this.dataService.createTactics({
                                                companyId: ele1.companyId,
                                                description: ele1.description,
                                                startDate: ele1.startDate,
                                                endDate: ele1.endDate,
                                                objectiveId: resp.id,
                                                name: ele1.name,
                                                projectId: ele1.projectId,
                                                status: ele1.status,
                                                type: ele1.type,
                                                dependency: ele1.pDepend,
                                                strategyId: respon.id,
                                                workStreamId: ele1.workStreamId,
                                                assignBy: ele1.assignBy,
                                                copy: "duplicate",
                                                goalsId: duplicate.goalsId
                                            }).subscribe(res1 => {
                                                if (res1.status == 200) {
                                                    if (ele1.children.length > 0)
                                                        ele1.children.forEach(el2 => {
                                                            this.dataService.createActivity({
                                                                companyId: el2.companyId,
                                                                description: el2.description,
                                                                startDate: el2.startDate,
                                                                endDate: el2.endDate,
                                                                objectiveId: resp.id,
                                                                name: el2.name,
                                                                projectId: el2.projectId,
                                                                status: el2.status,
                                                                type: el2.type,
                                                                tacticsId: res1.id,
                                                                strategyId: respon.id,
                                                                dependency: el2.pDepend,
                                                                workStreamId: el2.workStreamId,
                                                                assignBy: el2.assignBy,
                                                                copy: "duplicate",
                                                                goalsId: duplicate.goalsId
                                                            }).subscribe(data => {
                                                                if (data.status == 200) {
                                                                    this.toaster.success('Copy Created Successfully');
                                                                    this.goalList();
                                                                }
                                                            })
                                                        })
                                                }
                                                else {
                                                    this.toaster.success('Copy Created Successfully');
                                                    this.goalList();
                                                }

                                            })
                                        });
                                    }
                                }
                                else {
                                    this.toaster.success('Copy Created Successfully');
                                    this.goalList();
                                }
                            })
                        });

                    }
                    else {
                        this.toaster.success('Copy Created Successfully');
                        this.goalList();
                    }
                }
                if (resp.status == 500) {
                    this.toaster.error('Unable To Proccess');
                }
            })


        }
        // }
        // //create duplicate Strategy
        if (num === 7) {

            this.dataService.createStrategy({
                companyId: duplicate.companyId,
                description: duplicate.description,
                startDate: duplicate.startDate,
                endDate: duplicate.endDate,
                objectiveId: duplicate.objectiveId,
                name: duplicate.name,
                projectId: duplicate.projectId,
                status: duplicate.status,
                type: duplicate.type,
                dependency: duplicate.pDepend,
                assignBy: duplicate.assignBy,
                copy: "duplicate",
                goalsId: duplicate.goalsId
            }).subscribe(respon => {
                if (respon.status == 200) {
                    if (duplicate.children.length > 0) {
                        duplicate.children.forEach(ele1 => {
                            this.dataService.createTactics({
                                companyId: ele1.companyId,
                                description: ele1.description,
                                startDate: ele1.startDate,
                                endDate: ele1.endDate,
                                objectiveId: ele1.objectiveId,
                                name: ele1.name,
                                projectId: ele1.projectId,
                                status: ele1.status,
                                type: ele1.type,
                                dependency: ele1.pDepend,
                                strategyId: respon.id,
                                workStreamId: ele1.workStreamId,
                                assignBy: ele1.assignBy,
                                copy: "duplicate",
                                goalsId: duplicate.goalsId
                            }).subscribe(res1 => {
                                if (res1.status == 200) {
                                    if (ele1.children.length > 0)
                                        ele1.children.forEach(el2 => {
                                            this.dataService.createActivity({
                                                companyId: el2.companyId,
                                                description: el2.description,
                                                startDate: el2.startDate,
                                                endDate: el2.endDate,
                                                objectiveId: ele1.objectiveId,
                                                name: el2.name,
                                                projectId: el2.projectId,
                                                status: el2.status,
                                                type: el2.type,
                                                tacticsId: res1.id,
                                                strategyId: respon.id,
                                                dependency: el2.pDepend,
                                                assignBy: el2.assignBy,
                                                copy: "duplicate",
                                                goalsId: duplicate.goalsId
                                            }).subscribe(data => {
                                                if (data.status == 200) {
                                                    this.toaster.success('Copy Created Successfully');
                                                    this.goalList();
                                                }
                                            })
                                        })
                                }
                                else {
                                    this.toaster.success('Copy Created Successfully');
                                    this.goalList();
                                }

                            })
                        });
                    }
                }
                else {
                    this.toaster.success('Copy Created Successfully');
                    this.goalList();
                }
            })

        }

        if (num === 8) {
            this.dataService.createTactics({
                companyId: duplicate.companyId,
                description: duplicate.description,
                startDate: duplicate.startDate,
                endDate: duplicate.endDate,
                objectiveId: duplicate.objectiveId,
                name: duplicate.name,
                projectId: duplicate.projectId,
                status: duplicate.status,
                type: duplicate.type,
                dependency: duplicate.pDepend,
                strategyId: duplicate.strategyId,
                workStreamId: duplicate.workStreamId,
                assignBy: duplicate.assignBy,
                copy: "duplicate",
                goalsId: duplicate.goalsId
            }).subscribe(res1 => {
                if (res1.status == 200) {
                    if (duplicate.children.length > 0) {
                        duplicate.children.forEach(el2 => {
                            this.dataService.createActivity({
                                companyId: el2.companyId,
                                description: el2.description,
                                startDate: el2.startDate,
                                endDate: el2.endDate,
                                objectiveId: el2.objectiveId,
                                name: el2.name,
                                projectId: el2.projectId,
                                status: el2.status,
                                type: el2.type,
                                tacticsId: res1.id,
                                dependency: el2.pDepend,
                                strategyId: duplicate.strategyId,
                                assignBy: el2.assignBy,
                                copy: "duplicate",
                                goalsId: duplicate.goalsId
                            }).subscribe(data => {
                                if (data.status == 200) {
                                    this.toaster.success('Copy Created Successfully');
                                    this.goalList();
                                }
                            })
                        })
                    }
                    else {
                        this.toaster.success('Copy Created Successfully');
                        this.goalList();
                    }
                }
            })
        }
        if (num === 9) {
            this.dataService.createActivity({
                tacticsId: duplicate.tacticsId,
                companyId: duplicate.companyId,
                description: duplicate.description,
                startDate: duplicate.startDate,
                endDate: duplicate.endDate,
                name: duplicate.name,
                projectId: duplicate.projectId,
                status: duplicate.status,
                type: duplicate.type,
                workStreamId: duplicate.workStreamId,
                assignBy: duplicate.assignBy,
                objectiveId: duplicate.objectiveId,
                dependency: duplicate.pDepend,
                copy: "duplicate",
                goalsId: duplicate.goalsId,
                strategyId: duplicate.strategyId
            }).subscribe(resp => {
                if (resp.status == 200) {
                    this.goalList();
                    this.toaster.success('Copy Created Successfully');
                }
                if (resp.status == 208) {
                    this.toaster.error('Copy Created Successfully');
                }
                if (resp.status == 500) {
                    this.toaster.error('Unable To Proccess');
                }
            })
        }
    }
    expended(node: any, id) {
        if (node.type == 'goal') {
            if (node.isExpanded == true) {
                this.dataService.updateGoal(id, { isExpanded: 1 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }
            else if (node.isExpanded == false) {
                this.dataService.updateGoal(id, { isExpanded: 0 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }

        }
        if (node.type == 'objective') {
            if (node.isExpanded == true) {
                this.dataService.updateObjective(id, { isExpanded: 1 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }
            else if (node.isExpanded == false) {
                this.dataService.updateObjective(id, { isExpanded: 0 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }

        }
        if (node.type == 'strategy') {
            if (node.isExpanded == true) {
                this.dataService.updateStrategy(id, { isExpanded: 1 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }
            else if (node.isExpanded == false) {
                this.dataService.updateStrategy(id, { isExpanded: 0 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }
        }
        if (node.type == 'tactic') {
            if (node.isExpanded == true) {
                this.dataService.updateTactics(id, { isExpanded: 1 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }
            else if (node.isExpanded == false) {
                this.dataService.updateTactics(id, { isExpanded: 0 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }
        }
        if (node.type == 'key') {
            if (node.isExpanded == true) {
                this.dataService.updateActivity(id, { isExpanded: 1 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }
            else if (node.isExpanded == false) {
                this.dataService.updateActivity(id, { isExpanded: 0 }).subscribe(data => {
                    if (data.status == 200) {
                        // this.toaster.success('Updated Successfully')
                    }
                })
            }
        }
    }

    exportAsXLSX(): void {
        this.toolbarClick('Excel Export')
    }

    toolbarClick(args: any): void {
        switch (args) {
            case 'PDF Export':
                this.grid.pdfExport();
                break;
            case 'Excel Export':
                this.grid.excelExport();
                break;
            case 'CSV Export':
                this.grid.csvExport();
                break;
        }
    }

    populationValue(field: string, data: Object): number {
        return data[field] / 1000000;
    }
    exportQueryCellInfo(args: ExcelQueryCellInfoEventArgs | PdfQueryCellInfoEventArgs): void {
        if (args.column.headerText === 'Employee Image') {

        }
        if (args.column.headerText === 'Email ID') {

        }
    }
}


