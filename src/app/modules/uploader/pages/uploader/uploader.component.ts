import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewChecked,
  OnDestroy,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FormControl, FormGroup } from "@angular/forms";
import {
  DomSanitizer,
  SafeHtml,
  SafeStyle,
  SafeScript,
  SafeUrl,
  SafeResourceUrl,
} from "@angular/platform-browser";
import { interval } from "rxjs";
import { fromEvent } from "rxjs";
import {
  map,
  filter,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from "rxjs/operators";

import { Constants } from "../../../../constants/constants";
import { BackendService } from "../../../../services/backend.service";
import { UserDataService } from "../../../../services/user-data.service";
import { LoadingService } from "../../../../services/loading.service";
import { S3Service } from "../../../../services/s3.service";
import { CommonService } from "../../../../services/common.service";

import { GEOLocationService } from "../../../../services/geo-location.service";
import { EventService } from "../../../../services/event.service";
import { environment } from "../../../../../environments/environment";
import { HtmlAstPath } from "@angular/compiler";
import {ProxyService} from '../../../../proxy.service'


declare var $: any;
var _this;
var isPolicySelectLoad = false;
var actionSubscribe;

@Component({
  selector: "app-uploader",
  templateUrl: "./uploader.component.html",
  styleUrls: ["./uploader.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class UploaderComponent implements OnInit, AfterViewChecked {
  constructor(
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private backendService: BackendService,
    private loadingService: LoadingService,
    private router: Router,
    public userData: UserDataService,
    public s3: S3Service,
    protected sanitizer: DomSanitizer,
    private event: EventService,
    public geo: GEOLocationService,
    public commonService: CommonService,
    private procyservice: ProxyService
  ) {
    _this = this;
  }
  jsonForm: any;  

  userRole = 1;
  formData: any = {};
  constants = Constants;
  templateId;
  isPreviewMode = false;
  policies = [];
  table: any = {};
  isFillForm = false;
  isReviewForm = false;

  /*To hide button actions button*/
  isReadOnly = false;

  /*To check is submitted form opened in edit mode*/
  isMyFormEdit = false;

  assignId;
  isHeadingOpen = false;
  isAlignedOpen = false;

  env = environment;

  selectedTableType;
  reviewComment: any = {};
  selctValue:any;

  async ngOnInit() {
    this.userRole = this.userData.getUserData().role;

    // this.userRole = this.route.snapshot.data['role'];
    this.isFillForm = this.route.snapshot.data["isFillForm"];
    this.isReviewForm = this.route.snapshot.data["isReviewForm"];

    this.isReadOnly = this.route.snapshot.data["isReadOnly"];

    this.isMyFormEdit = this.route.snapshot.data["isMyFormEdit"];

    this.route.params.subscribe((params) => {
      if (this.userData.getSelectedOrg()) {
        this.userRole = this.userData.getSelectedOrg().role;
      }

      if (params.templateId != undefined) {
        this.getTemplateById(params.templateId);
        this.templateId = params.templateId;
        this.assignId = params.empId;
      } else if (params.reviewFormId != undefined) {
        this.getApproveFormById(params.reviewFormId);
      }
    });

    /*Call if user role is super admin*/
    if (this.userRole == Constants.SUPER_ADMIN) {
      this.getPolicyList(undefined);
    }
    const source = interval(3000);
    actionSubscribe = source.subscribe((val) => this.actions());
  }

  formSubmit(form){
    console.log('Submitted Form' , form.value)
  }
  onChangeradion(selectValue: any) {
    this.selctValue = selectValue;
    console.log('selectValue', this.selctValue);
  }

  /*Get template by id*/
  getApproveFormById(id) {
    this.loadingService.apiStart();

    this.backendService.getsubmittedFormById(id).subscribe(
      (result) => {
        this.loadingService.apiStop();
        this.formData = result.data[0];

        /*Replaced organization name is user not super admin*/
        if (this.userRole != Constants.SUPER_ADMIN) {
          while (
            this.formData.content.includes(
              Constants.ORGANISATION_EMPTY_PLACEHOLDER
            )
          ) {
            this.formData.content = this.formData.content.replace(
              Constants.ORGANISATION_EMPTY_PLACEHOLDER,
              this.userData.getUserData().organization_name.trim()
            );
          }
        }

        /*Load actual content*/
        this.formData.content = this.sanitizer.bypassSecurityTrustHtml(
          this.formData.content
        );

        setTimeout(function () {
          let q = document.getElementsByClassName("question");
          for (let i = 0; i < q.length; ++i) {
            _this.pasteTextAsPlainText(q[i]);
          }

          let b = document.getElementsByClassName("block");
          for (let i = 0; i < b.length; ++i) {
            _this.pasteTextAsPlainText(b[i]);
          }

          _this.actions();
        }, 2000);
      },
      (error) => {
        this.loadingService.apiStop();
        console.log("Error");
      }
    );
  }

  actions() {
    /*Add conditions on editor according to user role*/
    /*IF role is admin question is on edit mode*/
    if (this.userRole == Constants.SUPER_ADMIN) {
      $("#formEditor .question").attr("contenteditable", "true");
      $("#formEditor .block").attr("contenteditable", "true");
      $("#formEditor table td").attr("contenteditable", "true");
      $("#formEditor .answer").attr("contenteditable", "true");
      $("#formEditor .answer").attr("data-text", "Enter response here");
      this.addRemoveButton();
      this.allowTabelDataForAdminOnly();
      this.addCheckboxButtonInContainer();
      this.addRadioButtonInContainer();
      this.addTableRowButtonInRiskTable();

      /*To remove element e.g block, question, table etc*/
      $(".remove-btn").click(function () {
        $(this).closest(".question-container").slideUp();
        let __this = this;
        setTimeout(function () {
          $(__this).closest(".question-container").remove();
        }, 500);
      });

      // /*To add more checkbox option in question*/
      $(".add-cb-btn").on("click", function (event) {
        event.stopImmediatePropagation();
        let containar = $(this).closest(".question-container");
        _this.addCheckBoxOption(containar);
      });

      // /*To add more radio option in question*/
      $(".add-radio-btn").on("click", function (event) {
        event.stopImmediatePropagation();
        let containar = $(this).closest(".question-container");
        _this.addRadioOption(containar);
      });

      /*Disable enter button for checkbox option*/
      let cbOptions = document.getElementsByClassName("cbk-lbl");
      for (let i = 0; i < cbOptions.length; ++i) {
        _this.disabledEnterButton(cbOptions[i]);
      }

      // /*To add row risk table in question*/
      $(".add-row-btn").on("click", function (event) {
        event.stopImmediatePropagation();
        let table = $(this).closest(".question-container").find("table");
        let coloumn = $(this)
          .closest(".question-container")
          .find("table")
          .find("tr:first td").length;

        let row = table[0].insertRow(-1);

        for (let l = 0; l < coloumn; ++l) {
          let cell = row.insertCell(-1);
          cell.style.width = 100 / coloumn + "%";
          cell.setAttribute("contenteditable", "true");
        }

        _this.actions();
      });

      /*Delete check box option */
      _this.deleteCheckboxOption();

      /*Delete radio option */
      _this.deleteRadioOption();

      /*Drag and drop functionality adding*/
      _this.addDragAndDrop();

      /*Text selection watch*/
      _this.textSelectionWatch();
    } else if (this.isReviewForm) {
      /*Not allow to click on any element*/
      $("#formEditor .question-container").css("pointer-events", "none");

      /*Answer editable false*/
      $("#formEditor .answer").attr("contenteditable", "false");
      $("#formEditor .answer").attr("data-text", "Enter response here");

      /*Question editable false*/
      $("#formEditor .question").attr("contenteditable", "false");

      /*Block editable false*/
      $("#formEditor .block").attr("contenteditable", "false");

      /*Check box editable false*/
      $("#formEditor .cbk-lbl").attr("contenteditable", "false");

      /*Lat lang editable false*/
      $("#formEditor .value").attr("contenteditable", "false");

      /*Table td editable false*/
      // $('#formEditor table td').attr("contenteditable","false");
    } else {
      $("#formEditor .answer").attr("contenteditable", "true");
      $("#formEditor .answer").attr("data-text", "Enter response here");
      $("#formEditor .question").attr("contenteditable", "false");
      $("#formEditor .block").attr("contenteditable", "false");
      this.tabelEditModeForUser();
    }

    $(".locate-me").click(function (event) {
      _this.setGeoLocation(
        $(this).closest(".geo-block").find(".latitude"),
        $(this).closest(".geo-block").find(".longitude")
      );
    });

    /*For policy look up*/
    this.onSearchChange();

    /*On clicked rating button*/
    this.onClickRatingButton();

    /*On clicked check box add checked attribute*/
    this.onclikedCheckbox();

    /*On clicked radio box add checked attribute*/
    this.onclikedRadioGroup();

    /*On clicked select and on choose option set selected attribute*/
    this.onclikedSelectTag();

    /*For image upload events*/
    this.questionImageUploadEvent();
  }

  questionImageUploadEvent() {
    $(".remove-img-button").click(function (event) {
      event.stopImmediatePropagation();
      let parent = $(this).closest(".img-container").slideUp().remove();
    });

    $(".img-upload-placeholder").on("click", function (event) {
      event.stopImmediatePropagation();
      _this.onClickedSelectImage(this);
    });
  }

  /*Check box clicked event*/
  onclikedCheckbox() {
    $("input[type='checkbox']").on("click", function (event) {
      event.stopImmediatePropagation();

      /*Add checked attribute if checked else remove*/
      $(this).prop("checked")
        ? this.setAttribute("checked", "checked")
        : this.removeAttribute("checked");
    });
  }

  /*On select select input's value trigger to add selected attribute*/
  onclikedSelectTag() {
    $("select").change(function (event) {
      event.stopImmediatePropagation();
      let value = $(this).val();
      $(this)
        .find("option")
        .each(function (index, element) {
          /*Removed all option's selected attribute*/
          this.removeAttribute("selected");

          /*Add selected attribute to selected option only*/
          if (value == element.value) {
            this.setAttribute("selected", "selected");
          }
        });
    });
  }

  /*Radio button clicked event*/
  onclikedRadioGroup() {
    $("input[type='radio']").on("click", function (event) {
      event.stopImmediatePropagation();

      /*Removed all radio button's checked property of selected radio group using name attribute*/
      $("input[type='radio'][name=" + $(this).attr("name") + "]").each(
        function () {
          this.removeAttribute("checked");
        }
      );

      /*Add checked attribute to clicked radio button*/
      $(this).prop("checked")
        ? this.setAttribute("checked", "checked")
        : this.removeAttribute("checked");
    });
  }

  /*Formating tool start*/
  textSelectionWatch() {
    $(".normal-text").mouseup(function (event) {
      event.stopImmediatePropagation();

      let selection = _this.getSelected();
      if (selection.toString()) {
        let toolbarWidth = $(".custom-toolbar").width();
        let deviceWidth = screen.width;
        let clientX = event.clientX;

        /*Open toolbar to left side of is going to outside screen*/
        if (toolbarWidth + clientX >= deviceWidth - 50) {
          clientX = clientX - toolbarWidth;
        }

        $("div.custom-toolbar").css("display", "block");
        $("div.custom-toolbar").css("top", event.clientY);
        $("div.custom-toolbar").css("left", clientX);
      } else {
        $("div.custom-toolbar").css("display", "none");
      }
    });

    // $('.form-uploader').click(function(e) {

    //   event.stopImmediatePropagation();
    //   var container = $(".custom-toolbar");

    //   // If the target of the click isn't the container
    //   if(!container.is(e.target) && container.has(e.target).length === 0){
    //     _this.closeToolbar();
    //   }
    // });
  }

  closeToolbar() {
    $("div.custom-toolbar").css("display", "none");
  }

  getSelected() {
    if (window.getSelection) {
      return window.getSelection();
    } else if (document.getSelection) {
      return document.getSelection();
    } else {
      var selection =
        document["selection"] && document["selection"].createRange();

      if (selection.text) {
        return selection.text;
      }
      return false;
    }
    return false;
  }

  formatDoc(sCmd, sValue) {
    document.execCommand(sCmd, false, sValue);
  }
  /*Formating tool end*/

  addDragAndDrop() {
    // $("#formEditor").sortable();

    $("#formEditor").on("mousedown", function (event) {
      $("#formEditor").sortable();
    });

    /*On content editable div clicked remove sortable*/
    $("div[contenteditable='true']").on("click", function (event) {
      event.stopImmediatePropagation();
      $(".sortable").sortable("destroy");
      this.focus();
    });

    /*On content editable span clicked remove sortable*/
    $("span[contenteditable='true']").on("click", function (event) {
      event.stopImmediatePropagation();
      $(".sortable").sortable("destroy");
      this.focus();
    });

    /*On content editable td clicked remove sortable*/
    $("td[contenteditable='true']").on("click", function (event) {
      event.stopImmediatePropagation();
      $(".sortable").sortable("destroy");
      this.focus();
    });
  }

  pasteTextAsPlainText(element) {
    element.addEventListener("paste", function (event) {
      event.preventDefault();
      document.execCommand(
        "inserttext",
        false,
        event["clipboardData"].getData("text/plain")
      );
    });
  }

  /*Policy look up*/
  onSearchChange() {
    if (isPolicySelectLoad) {
      return;
    }

    isPolicySelectLoad = true;

    let policyInput = document.getElementById("associatedPolicySelect");
    const subscription = fromEvent(policyInput, "input")
      .pipe(debounceTime(1000))
      .subscribe((e: KeyboardEvent) => {
        let value = (<HTMLInputElement>e.target).value;
        this.getPolicyList(value);
      });
  }

  customSearchFnPolicy(term, item) {
    term = term.toLowerCase();
    return (
      item.title.toLowerCase().indexOf(term) > -1 ||
      item.endpoint.toLowerCase().indexOf(term) > -1 ||
      item.suid.toLowerCase().indexOf(term) > -1 ||
      item.id == term ||
      item.type == term
    );
  }

  /*Get policy list*/
  getPolicyList(value) {
    let term =
      "?limit=100&" + (value != undefined && value != "" ? "q=" + value : "q=");

    this.loadingService.apiStart();

    this.backendService.getPolicyList(term).subscribe(
      (result) => {
        this.loadingService.apiStop();
        this.policies = result.data;
      },
      (error) => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      }
    );
  }

  /*Get template by id*/
  getTemplateById(id) {

    // this.procyservice.getFormById(id).subscribe((res)=>{
    //   console.log( 'result',res)
    //   this.jsonForm = res;      
    // } , (err)=>{
    //   console.log('error' , err);
      
    // })

    this.loadingService.apiStart();

    this.backendService.getSingleTemplateForm(id).subscribe(
      (result) => {
        this.loadingService.apiStop();
        if (result.code == 200) {
          this.formData = result.data;

          /*Replace magic tag names*/
          if (this.userRole != Constants.SUPER_ADMIN) {
            while (
              this.formData.content.includes(
                Constants.ORGANISATION_EMPTY_PLACEHOLDER
              )
            ) {
              this.formData.content = this.formData.content.replace(
                Constants.ORGANISATION_EMPTY_PLACEHOLDER,
                this.userData.getUserData().organization_name.trim()
              );
            }
          }

          /*Set content of form*/
          this.formData.content = this.sanitizer.bypassSecurityTrustHtml(
            this.formData.content
          );

          /*Set policy of form*/
          if (this.formData.policy != undefined) {
            this.formData.policyid = this.formData.policy[0];
          }

          /*Other form action*/
          setTimeout(function () {
            let q = document.getElementsByClassName("question");
            for (let i = 0; i < q.length; ++i) {
              _this.pasteTextAsPlainText(q[i]);
            }

            let b = document.getElementsByClassName("block");
            for (let i = 0; i < b.length; ++i) {
              _this.pasteTextAsPlainText(b[i]);
            }

            _this.actions();
          }, 2000);
        }
      },
      (error) => {
        this.loadingService.apiStop();
        console.log("Error");
      }
    );
  }

  /*This is only for super admin to add new question*/
  addNextQuestion() {
    let editor = document.getElementById("formEditor");
    let nextQuetion = document.createElement("div");
    editor.appendChild(nextQuetion);
    nextQuetion.classList.add("question-container");
    let question = document.createElement("div");
    let answer = document.createElement("div");
    question.classList.add("question");
    question.setAttribute("contenteditable", "true");
    question.setAttribute("data-text", "Enter question here");
    answer.classList.add("answer");
    answer.setAttribute("contenteditable", "true");
    nextQuetion.appendChild(question);
    nextQuetion.appendChild(answer);
    question.focus();
    _this.pasteTextAsPlainText(question);
  }

  /*Add question to element*/
  addQuestionElement(element) {
    let question = document.createElement("div");
    question.classList.add("question");
    question.setAttribute("contenteditable", "true");
    question.setAttribute("data-text", "Enter question here");
    element.appendChild(question);
    question.focus();
  }

  /*This is only for super admin to add Block*/
  addNextBlock() {
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    let block = document.createElement("div");
    block.classList.add("block");
    block.classList.add("normal-text");
    block.setAttribute("contenteditable", "true");
    block.setAttribute("data-text", "Enter text here");
    nextBlock.appendChild(block);
    block.focus();
    _this.pasteTextAsPlainText(block);
  }

  /*This is only for super admin to add Block*/
  addRadioButtonQuestion() {
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    nextBlock.classList.add("radio-question");
    nextBlock.setAttribute("id", "radio-group-" + $(".radio-question").length);
    _this.addQuestionElement(nextBlock);
    _this.addRadioOption(nextBlock);
  }

  /*To add option in checkbox question*/
  addRadioOption(element) {
    let block = document.createElement("div");
    // block.setAttribute("contenteditable", "true");
    let checkbox = document.createElement("input");
    block.classList.add("radio-block");
    checkbox.setAttribute("type", "radio");
    checkbox.setAttribute("name", $(element).attr("id"));
    block.innerHTML = "&nbsp;";

    block.appendChild(checkbox);
    element.append(block);

    let marker = document.createElement("span");
    marker.setAttribute("contenteditable", "false");
    block.appendChild(marker);
    marker.classList.add("checkmark");

    let span = document.createElement("span");
    span.classList.add("cbk-lbl");
    span.setAttribute("contenteditable", "true");
    block.appendChild(span);
    span.setAttribute("data-text", "Enter label here");
    _this.pasteTextAsPlainText(block);
    span.focus();
    this.addRadioOptionDeleteBtn(block);
    _this.actions();
  }

  addRadioOptionDeleteBtn(element) {
    let button = document.createElement("button");
    button.innerHTML = "&times;";
    button.classList.add("rm-radio-option-btn");
    button.setAttribute("type", "button");
    element.appendChild(button);
    this.deleteRadioOption();
  }

  deleteRadioOption() {
    $(".rm-radio-option-btn").on("click", function (event) {
      event.stopImmediatePropagation();
      $(this).closest(".radio-block").remove();
    });
  }

  /*This is only for super admin to add Block*/
  addCheckBoxQuestion() {
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    nextBlock.classList.add("cb-question");
    _this.addQuestionElement(nextBlock);
    _this.addCheckBoxOption(nextBlock);
  }

  /*To add option in checkbox question*/
  addCheckBoxOption(element) {
    let block = document.createElement("div");
    // block.setAttribute("contenteditable", "true");
    let checkbox = document.createElement("input");
    block.classList.add("cb-block");
    checkbox.setAttribute("type", "checkbox");
    block.innerHTML = "&nbsp;";

    block.appendChild(checkbox);
    element.append(block);

    let marker = document.createElement("span");
    marker.setAttribute("contenteditable", "false");
    block.appendChild(marker);
    marker.classList.add("checkmark");

    let span = document.createElement("span");
    span.classList.add("cbk-lbl");
    span.setAttribute("contenteditable", "true");
    block.appendChild(span);
    span.setAttribute("data-text", "Enter label here");
    _this.pasteTextAsPlainText(block);
    span.focus();
    this.addCheckBoxOptionDeleteBtn(block);
    _this.actions();
  }

  addCheckBoxOptionDeleteBtn(element) {
    let button = document.createElement("button");
    button.innerHTML = "&times;";
    button.classList.add("rm-cb-option-btn");
    button.setAttribute("type", "button");
    element.appendChild(button);
    this.deleteCheckboxOption();
  }

  deleteCheckboxOption() {
    $(".rm-cb-option-btn").on("click", function (event) {
      event.stopImmediatePropagation();
      $(this).closest(".cb-block").remove();
    });
  }

  disabledEnterButton(element) {
    $(element).keypress(function (evt) {
      var keycode = evt.charCode || evt.keyCode;
      if (keycode == 13) {
        //Enter key's keycode
        return false;
      }
    });
  }

  /*This is only for super admin to add Block*/
  addSelectQuestion() {
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    _this.addQuestionElement(nextBlock);
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    let block = document.createElement("div");
    block.setAttribute("contenteditable", "true");
    let select = document.createElement("select");
    block.classList.add("block");
    block.appendChild(select);

    let option3 = document.createElement("option");
    option3.text = "NA";
    option3.value = "NA";
    select.appendChild(option3);

    let option1 = document.createElement("option");
    option1.text = "Yes";
    option1.value = "Yes";
    select.appendChild(option1);

    let option2 = document.createElement("option");
    option2.text = "No";
    option2.value = "No";

    select.appendChild(option2);
    nextBlock.appendChild(block);

    let range = document.createRange();
    let selection = window.getSelection();
    range.setStart(nextBlock.childNodes[0], 1);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
    block.focus();
    _this.pasteTextAsPlainText(block);
  }

  /*This is only for super admin to add Block*/
  addRatingQuestion() {
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    nextBlock.classList.add("rating-question");
    _this.addQuestionElement(nextBlock);
    let block = document.createElement("div");
    block.classList.add("rating-block");
    for (let i = 1; i <= 5; i++) {
      let ratingBtnContainer = document.createElement("div");
      ratingBtnContainer.classList.add("rating-btn-container");

      let ratingBtn = document.createElement("button");

      ratingBtn.setAttribute("type", "button");
      ratingBtn.setAttribute("id", i + "");
      ratingBtn.classList.add("rating-btn");
      ratingBtn.classList.add("rating-btn-" + i);
      ratingBtnContainer.appendChild(ratingBtn);
      block.appendChild(ratingBtnContainer);
      nextBlock.appendChild(block);
      $(ratingBtnContainer).append('<div class="rat-no">' + i + " </div>");
    }

    block.focus();
    _this.pasteTextAsPlainText(block);
  }

  /*For rating selection*/
  onClickRatingButton() {
    // /*To click on rating button*/
    $(".rating-btn").on("click", function (event) {
      event.stopImmediatePropagation();
      let parent = $(this).closest(".rating-question").find(".rating-btn");

      for (let k = 0; k < 5; k++) {
        $(parent[k]).removeClass("rating-filled");
      }
      for (let k = 0; k < $(this).attr("id") || 0; k++) {
        $(parent[k]).addClass("rating-filled");
      }
    });
  }

  /*To add table*/
  addTabel() {
    $("#addTableModal").modal("hide");
    let row = this.table.rows;
    let coloumn = this.table.column;
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    _this.addQuestionElement(nextBlock);
    let table = document.createElement("table");
    table.focus();
    nextBlock.appendChild(table);
    for (let i = 0; i < row; ++i) {
      let row = table.insertRow(-1);
      for (let l = 0; l < coloumn; ++l) {
        let cell = row.insertCell(-1);
        cell.style.width = 100 / coloumn + "%";
        cell.setAttribute("contenteditable", "true");
      }
    }
  }

  /*To add risk table*/
  addRiskTabel() {
    $("#addTableModal").modal("hide");
    let row = this.table.rows;
    let coloumn = this.table.column;
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    _this.addQuestionElement(nextBlock);
    let table = document.createElement("table");
    nextBlock.classList.add("risk-table");

    table.focus();
    nextBlock.appendChild(table);
    for (let i = 0; i < row; ++i) {
      let row = table.insertRow(-1);
      for (let l = 0; l < coloumn; ++l) {
        let cell = row.insertCell(-1);
        cell.style.width = 100 / coloumn + "%";
        cell.setAttribute("contenteditable", "true");
      }
    }

    _this.actions();
  }

  addTableRowButtonInRiskTable() {
    let containars = $("#formEditor .question-container.risk-table");
    for (let i = 0; i < containars.length; ++i) {
      let containar = containars[i];
      let isAddBtn = containar.getElementsByClassName("add-row-btn").length;

      if (isAddBtn > 0) {
        continue;
      }

      let button = document.createElement("button");
      button.setAttribute("type", "button");
      button.innerHTML = '<img src="/assets/icons8-plus.svg">';
      button.classList.add("add-row-btn");
      containar.appendChild(button);
    }
  }

  /*This is only for super admin to add Block*/
  addImageQuestion() {
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    _this.addQuestionElement(nextBlock);
    let block = document.createElement("div");
    block.classList.add("image-block");
    nextBlock.appendChild(block);

    let imgContainer = document.createElement("div");
    imgContainer.classList.add("img-container");
    imgContainer.classList.add("img-upload-placeholder");
    block.appendChild(imgContainer);

    imgContainer.innerHTML =
      '<div class="upload-lbl">\r\n<div class="plus">+</div>\r\n<div class="text">Upload Image</div>\r\n</div>';
    $(".img-upload-placeholder").on("click", function (event) {
      event.stopImmediatePropagation();
      _this.onClickedSelectImage(this);
    });
  }

  setImageInUploader(image, context) {
    let parent = $(context).closest(".image-block");
    parent.append(
      '<div class="img-container"><button class="remove-img-button" type="button">\u00D7</button>\r\n    \r\n    <img class="uploaded-img" src="  ' +
        image +
        '  ">\r\n</div>'
    );

    $(".remove-img-button").click(function (event) {
      let parent = $(this).closest(".img-container").slideUp().remove();
    });
  }

  onClickedSelectImage(context) {
    const Imageinput = document.createElement("input");
    Imageinput.setAttribute("type", "file");
    Imageinput.setAttribute("multiple", "true");
    Imageinput.setAttribute(
      "accept",
      "image/png, image/gif, image/jpeg, image/bmp, image/x-icon"
    );
    Imageinput.classList.add("ql-image");

    Imageinput.addEventListener("change", () => {
      const file = Imageinput.files;
      this.imageUploadOnS3(file, context);
    });
    Imageinput.click();
  }

  imageUploadOnS3(files, context): void {
    var successImg = 0;
    for (var i = 0; i < files.length; i++) {
      this.loadingService.apiStart();
      this.s3.uploadS3(
        files[i],
        "post",
        (data) => {
          this.loadingService.apiStop();
          if (context == undefined) {
            this.uploadNormalImg(data.Location);
          } else {
            this.setImageInUploader(data.Location, context);
          }
        },
        (error) => {
          console.log(error);
          this.loadingService.apiStop();
          this.toastr.error(error);
        }
      );
    }
  }

  addRemoveButton() {
    let containars = $("#formEditor .question-container");
    for (let i = 0; i < containars.length; ++i) {
      let containar = containars[i];
      let isRemovePresent = $(containar).find(".remove-btn").length;

      if (isRemovePresent > 0) {
        continue;
      }

      let button = document.createElement("button");
      button.setAttribute("type", "button");
      button.innerHTML = "&times;";
      button.classList.add("remove-btn");
      containar.appendChild(button);
    }
  }

  addCheckboxButtonInContainer() {
    let containars = $("#formEditor .question-container.cb-question");
    for (let i = 0; i < containars.length; ++i) {
      let containar = containars[i];
      let isAddBtn = containar.getElementsByClassName("add-cb-btn").length;

      if (isAddBtn > 0) {
        continue;
      }

      let button = document.createElement("button");
      button.setAttribute("type", "button");
      button.innerHTML = "Add more option";
      button.classList.add("add-cb-btn");
      containar.appendChild(button);
    }
  }

  addRadioButtonInContainer() {
    let containars = $("#formEditor .question-container.radio-question");
    for (let i = 0; i < containars.length; ++i) {
      let containar = containars[i];
      let isAddBtn = containar.getElementsByClassName("add-radio-btn").length;

      if (isAddBtn > 0) {
        continue;
      }

      let button = document.createElement("button");
      button.setAttribute("type", "button");
      button.innerHTML = "Add more option";
      button.classList.add("add-radio-btn");
      containar.appendChild(button);
    }
  }

  addGeoLocationQuestion() {
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    nextBlock.classList.add("geo-question");
    _this.addQuestionElement(nextBlock);
    $(nextBlock).append(
      '<div class="geo-block">\r\n\t<div>\r\n        <span class="key">Longitude - </span><span data-text=" Type here" contenteditable="true" class="value longitude"></span>\r\n    </div>\r\n    <div>\r\n        <span class="key"> Latitude - </span><span data-text=" Type here" contenteditable="true" class="value latitude"></span>\r\n    </div>\r\n    <button class="locate-me" type="button"> LOCATE ME </button>\r\n    <p class="note">Using the locate me feature would require you to grant location access to your browser so that it can communicate your coordinates to us.</p>\r\n</div>'
    );

    $(".locate-me").click(function (event) {
      _this.setGeoLocation(
        $(this).closest(".geo-block").find(".latitude"),
        $(this).closest(".geo-block").find(".longitude")
      );
    });
  }

  setGeoLocation(lat, lng) {
    _this.loadingService.apiStart();
    _this.geo.getPosition().then(
      (pos) => {
        _this.loadingService.apiStop();
        lat.text(pos.lat);
        lng.text(pos.lng);
      },
      (error) => {
        this.loadingService.apiStop();
        this.toastr.error(error.message);
        console.log(error);
      }
    );
  }

  addOrganisationPlaceholder() {
    document.execCommand(
      "insertText",
      false,
      Constants.ORGANISATION_EMPTY_PLACEHOLDER
    );
  }

  onClickPreview() {
    this.formData.content = this.sanitizer.bypassSecurityTrustHtml(
      document.getElementById("formEditor").innerHTML
    );
    $("#formEditor .answer").attr("contenteditable", "true");
    $("#formEditor .answer").attr("data-text", "Enter response here");
  }

  tabelEditModeForUser() {
    $("#formEditor table td.filled").attr("contenteditable", "false");
  }

  allowTabelDataForAdminOnly() {
    $("#formEditor table td").keyup(function () {
      if (
        this.innerHTML == "" ||
        this.innerHTML == undefined ||
        this.innerHTML == null
      ) {
        $(this).removeClass("filled");
      } else {
        this.classList.add("filled");
      }
    });
  }

  /*Add Normal Img*/
  uploadNormalImg(url) {
    let editor = document.getElementById("formEditor");
    let nextBlock = document.createElement("div");
    editor.appendChild(nextBlock);
    nextBlock.classList.add("question-container");
    _this.addQuestionElement(nextBlock);
    let block = document.createElement("div");
    block.classList.add("image-block");
    nextBlock.appendChild(block);

    let imgContainer = document.createElement("div");
    let normalImage = document.createElement("img");
    normalImage.classList.add("normal-image");
    normalImage.src = url;
    nextBlock.appendChild(normalImage);
  }

  ngAfterViewChecked() {}

  /*For admin to submit form*/
  superAdminFormSubmit(form) {
    let questions = $("#formEditor .question");
    for (let question of questions) {
      if (
        question.innerHTML == "" ||
        question.innerHTML == undefined ||
        question.innerHTML == null
      ) {
        this.toastr.error("Please fill all the questions before form submit!!");
        return;
      }
    }

    if (questions.length == 0) {
      this.toastr.error("Please add at least one question");
      return;
    }

    /*If template id present then edit form otherwise add new form*/
    this.templateId == undefined
      ? this.superAdminAddNewForm(form)
      : this.superAdminEditForm(form);
  }

  superAdminAddNewForm(form) {
    let payload = JSON.parse(JSON.stringify(this.formData));
    payload.content = document.getElementById("formEditor").innerHTML;
    console.log("Form json", payload);
    if (
      payload.policyid != null &&
      payload.policyid != undefined &&
      payload.policyid != ""
    ) {
      payload.policyid = [payload.policyid.endpoint];
    }

    this.loadingService.apiStart();

    this.backendService.templateFormSubmit(payload).subscribe(
      (result) => {
        this.loadingService.apiStop();
        if (result.code == 200) {
          this.formData = {};
          document.getElementById("formEditor").innerHTML = "";
          form.submitted = false;
          this.toastr.success("Form submitted successfully!!");
          window.history.back();
        }
      },
      (error) => {
        this.loadingService.apiStop();
      }
    );
  }

  superAdminEditForm(form) {
    let payload = JSON.parse(JSON.stringify(this.formData));
    payload.content = document.getElementById("formEditor").innerHTML;

    if (
      payload.policyid != null &&
      payload.policyid != undefined &&
      payload.policyid != ""
    ) {
      payload.policyid = [payload.policyid.endpoint];
    }

    this.loadingService.apiStart();

    this.backendService.templateFormEdit(payload).subscribe(
      (result) => {
        this.loadingService.apiStop();
        if (result.code == 200) {
          this.toastr.success("Form Edited successfully!!");
          window.history.back();
        }
      },
      (error) => {
        this.loadingService.apiStop();
      }
    );
  }

  exitForm() {
    /*Opening confirmation overlay*/
    this.event.sendMessage({
      type: Constants.OPEN_CONFIRMATION_OVERLAY,
      data: {
        heading: "Cancel template?",
        inline: true,
        callback: function () {
          _this.router.navigate(["form-templates"]);
        },
      },
    });
  }

  /*Fill form submit*/
  submitFilledForm(form) {
    let payload = JSON.parse(JSON.stringify(this.formData));
    // console.log(form);
    payload["act"] = 0;
    payload["assignid"] = this.assignId;

    payload["content"] = document.getElementById("formEditor").innerHTML;
    // console.log(payload["content"]);

    this.loadingService.apiStart();

    this.backendService.publishMyForm(payload).subscribe(
      (result) => {
        this.loadingService.apiStop();
        this.toastr.success("Form submitted");
        window.history.back();
      },
      (error) => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      }
    );
  }

  /*Edit filled form*/
  editFilledForm(form) {
    let payload = JSON.parse(JSON.stringify(this.formData));

    payload["act"] = 1;
    payload["content"] = document.getElementById("formEditor").innerHTML;

    this.loadingService.apiStart();

    this.backendService.editMyForm(payload).subscribe(
      (result) => {
        this.loadingService.apiStop();
        this.toastr.success("Form updated");
        window.history.back();
      },
      (error) => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      }
    );
  }

  /*Review commend submit*/
  submitReviewFormComment() {
    let payload = {
      comment: this.reviewComment.comment,
      id: this.formData.id,
      userid: this.formData.userid,
      assignid: this.formData.assignid,
    };

    this.loadingService.apiStart();

    this.backendService.submitReviewComment(payload).subscribe(
      (result) => {
        this.loadingService.apiStop();
        $("#addReworkCommentModal").modal("hide");
        this.toastr.success("Form sent for correction");
        window.history.back();
      },
      (error) => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      }
    );
  }

  /*Approve submitted form */
  approveSubmittedForm(form) {
    let payload = {};
    payload["id"] = this.formData.assignid;

    this.loadingService.apiStart();

    this.backendService.approveAssignedForm(payload).subscribe(
      (result) => {
        this.loadingService.apiStop();
        this.toastr.success("Form approved successfully!!");
        window.history.back();
      },
      (error) => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      }
    );
  }

  /*Reject submitted/ assigned form*/
  rejectAssignedForm(form) {
    let payload = {};
    payload["id"] = this.formData.assignid;

    this.loadingService.apiStart();

    this.backendService.rejectAssignedForm(payload).subscribe(
      (result) => {
        this.loadingService.apiStop();
        this.toastr.success("Form Rejected!!");
        window.history.back();
      },
      (error) => {
        this.loadingService.apiStop();
        this.toastr.error(error);
      }
    );
  }
  submitForm(formValue){
    console.log(formValue);
    
  }

  ngOnDestroy() {
    if (actionSubscribe) {
      actionSubscribe.unsubscribe();
    }
  }
}
