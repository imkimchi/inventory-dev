/**
 * Created by qnibus on 2015-12-21.
 */
$(document).ready(function () {
    // 폼체크
    $('#frmOrderStatus').validate({
        submitHandler: function (form) {
            if ($('input[name*=statusCheck]:checked').length < 1) {
                dialog_alert('선택된 주문 상품이 없습니다.');
                return false;
            }

            // 선택여부 확인
            if ($('#orderStatusTop').length && $('#frmOrderStatus > input[name=mode]').val() == 'combine_status_change') {
                if (_.isEmpty($('#orderStatusTop option:selected').val())) {
                    alert('주문상태를 선택해주세요.');
                    return false;
                }
            }

            // 주문번호 & 총 주문 횟수 저장(관리자 로그)
            if($('input[name="changeOrderNo"]').length > 0 && $('input[name="changeOrderCnt"]').length > 0) {
                $('input[name="changeOrderNo"]').val($('input[name*=statusCheck]:checked').eq(0).val().split('||')[0]);
                $('input[name="changeOrderCnt"]').val($('input[name*=statusCheck]:checked').length);
            }
            form.target = 'ifrmProcess';
            form.submit();
        }
    });

    // 리스트 정렬
    $('#sort, #pageNum').change(function (e) {
        $('#frmSearchOrder').submit();
    });

    // 선택주문 일괄변경 선택 처리
    $('#orderStatusTop, #orderStatusBottom').change(function (e) {
        var chkStatus = $(this).val().substr(0, 1);

        $('input#orderStatus').val($(this).val());
        $('select#orderStatusTop').val($(this).val());
        $('select#orderStatusBottom').val($(this).val());

        $('input[name*=statusCheck]:checked').each(function (idx) {
            // 에스크로 체크 후 배송 등록 여부를 체크
            var $checkbox = $(this);
            if ($(this).is('[name="statusCheck[p][]"]') || $(this).is('[name="statusCheck[g][]"]')) {
                $checkbox.prop('disabled', false);

                // 배송 처리를 선택하는 경우
                if (chkStatus == 'd') {
                    if ($(this).siblings('input[name*=escrowCheck]').val() == 'en') {
                        $checkbox.prop('disabled', true);
                    }
                }
            }
        });
    });

    // 주문 일괄 삭제처리
    $('.js-order-delete').click(function (e) {
        $.validator.setDefaults({dialog: false});
        $('#frmOrderStatus > input[name=mode]').val('combine_order_delete');
        if ($('input[name*=statusCheck]:checked').length > 0) {
            BootstrapDialog.confirm({
                type: BootstrapDialog.TYPE_DANGER,
                title: '주문삭제',
                message: '선택된 ' + $('input[name*=statusCheck]:checked').length + '개의 주문을 정말로 삭제 하시겠습니까?<br />삭제 시 정보는 복구 되지 않습니다.',
                closable: false,
                callback: function (result) {
                    if (result) {
                        $('#frmOrderStatus').submit();
                        $('#frmOrderStatus > input[name=mode]').val('combine_status_change');
                    }
                }
            });
        } else {
            $('#frmOrderStatus').submit();
            $('#frmOrderStatus > input[name=mode]').val('combine_status_change');
        }
    });

    // 선택주문 일괄 송장변경 처리
    if ($('.js-save-invoice').length > 0) {
        $('.js-save-invoice').click(function (e) {
            $('#frmOrderStatus > input[name=mode]').val('combine_invoice_change');
            $.validator.setDefaults({dialog: false});
            if ($('input[name*=statusCheck]:checked').length > 0) {
                BootstrapDialog.confirm({
                    type: BootstrapDialog.TYPE_DANGER,
                    title: '일괄 송장 변경',
                    message: '선택된 ' + $('input[name*=statusCheck]:checked').length + '개의 주문 송장번호를 정말로 저장 하시겠습니까?',
                    closable: false,
                    callback: function (result) {
                        if (result) {
                            $('#frmOrderStatus').submit();
                            $('#frmOrderStatus > input[name=mode]').val('combine_status_change');
                        }
                    }
                });
            } else {
                $('#frmOrderStatus').submit();
                $('#frmOrderStatus > input[name=mode]').val('combine_status_change');
            }
        });
    }

    // 주문 일괄 취소 처리
    $('.js-status-cancel').click(function (e) {
        $('#frmOrderStatus > input[name=mode]').val('combine_status_cancel');
        $.validator.setDefaults({dialog: false});
        if ($('input[name*=statusCheck]:checked').length > 0) {
            BootstrapDialog.confirm({
                type: BootstrapDialog.TYPE_DANGER,
                title: '주문취소',
                message: '선택된 ' + $('input[name*=statusCheck]:checked').length + '개의 주문을 정말로 취소처리 하시겠습니까?',
                closable: false,
                callback: function (result) {
                    if (result) {
                        $('#frmOrderStatus').submit();
                        $('#frmOrderStatus > input[name=mode]').val('combine_status_change');
                    }
                }
            });
        } else {
            $('#frmOrderStatus').submit();
            $('#frmOrderStatus > input[name=mode]').val('combine_status_change');
        }
    });

    // 주문 엑셀 다운 검색 관련
    var formSearch = $('#frmSearchOrder').serialize();
    $('input[name=\'excelSearch\']').val(formSearch);

    // 환불 폼 체크
    $('#frmOrderRefund').validate({
        submitHandler: function (form) {
            form.target = 'ifrmProcess';
            form.submit();
        }
    });

    // 주문 환불 처리
    $('.js-order-refund').click(function (e) {
        var orderNo = $(this).data('order-no');
        var handleSno = $(this).data('handle-sno');
        var mallSno = $(this).data('mall-sno');
        var channel = $(this).data('channel');
        var sno = $(this).data('order-goods-no');
        $.validator.setDefaults({dialog: false});
        if (channel == 'naverpay') {
            if (dialog_confirm('처리하시겠습니까?<br><b>(네이버페이 주문건과 관련된 환불처리는 "확인" 버튼을 클릭하시면 주문상세화면으로 이동됩니다.</b>)', function (result) {
                    if (result) {
                        refund_view_popup('../order/order_view.php?orderNo='+orderNo);
                    }
                }));
            return;
        }

        // 해외상점은 부분환불 불가
        if (mallSno > 1) {
            refund_view_popup('../order/refund_view.php?orderNo=' + orderNo + '&handleSno=' + handleSno + '&isAll=1&statusFl=1');
        } else {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_WARNING,
                title: '환불 상세보기',
                message: '환불접수 한 다른 상품들이 있을 시 같이 확인하시겠습니까?',
                closable: false,
                buttons: [{
                    label: '취소',
                    action: function (dialog) {
                        dialog.close();
                    }
                }, {
                    label: '아니오',
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        //location.href = '../order/refund_view.php?orderNo=' + orderNo + '&handleSno=' + handleSno + '&statusFl=1';
                        refund_view_popup('../order/refund_view.php?orderNo=' + orderNo + '&handleSno=' + handleSno + '&statusFl=1');
                        dialog.close();
                    }
                }, {
                    label: '예',
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        //location.href = '../order/refund_view.php?orderNo=' + orderNo + '&handleSno=' + handleSno + '&isAll=1&statusFl=1';
                        refund_view_popup('../order/refund_view.php?orderNo=' + orderNo + '&handleSno=' + handleSno + '&isAll=1&statusFl=1');
                        dialog.close();
                    }
                }]
            });
        }
    });

    // 주문 환불 상세보기
    $('.js-order-refund-detail').click(function (e) {
        var orderNo = $(this).data('order-no');
        var handleSno = $(this).data('handle-sno');
        var mallSno = $(this).data('mall-sno');
        $.validator.setDefaults({dialog: false});

        if (mallSno > 1) {
            refund_view_popup('../order/refund_view.php?orderNo=' + orderNo + '&handleSno=' + handleSno + '&isAll=1');
        } else {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_WARNING,
                title: '환불 상세보기',
                message: '환불완료 한 다른 상품들이 있을 시 같이 확인하시겠습니까?',
                closable: false,
                buttons: [{
                    label: '취소',
                    action: function (dialog) {
                        dialog.close();
                    }
                }, {
                    label: '예',
                    cssClass: 'btn-primary',
                    action: function (dialog) {
                        //location.href = '../order/refund_view.php?orderNo=' + orderNo + '&handleSno=' + handleSno + '&isAll=1';
                        refund_view_popup('../order/refund_view.php?orderNo=' + orderNo + '&handleSno=' + handleSno + '&isAll=1');
                        dialog.close();
                    }
                }]
            });
        }
    });

    // 사용자 환불/교환/반품신청 페이지의 승인처리
    $('.js-user-accept').click(function (e) {
        if ($('input[name*=statusCheck]:checked').length < 1) {
            alert('선택된 주문 상품이 없습니다.');
            return false;
        } else {
            var title = null;
            var params = {
                statusMode: $(this).data('status-mode').substring(0, 1),
                statusCheck: []
            };

            // 체크된 부분 데이터 구성
            $('input[name*=statusCheck]:checked').each(function (idx) {
                params.statusCheck.push($(this).val());
            });
            switch (params.statusMode) {
                case 'e':
                    title = '교환';
                    break;
                case 'b':
                    title = '반품';
                    break;
                case 'r':
                    title = '환불';
                    break;
            }

            $.post('layer_user_accept.php', params, function (data) {
                layer_popup(data, '고객 ' + title + '신청 승인처리');
            });
        }
    });

    // 사용자 환불/교환/반품신청 페이지의 거절처리
    $('.js-user-reject').click(function (e) {
        if ($('input[name*=statusCheck]:checked').length < 1) {
            alert('선택된 주문 상품이 없습니다.');
            return false;
        } else {
            var title = null;
            var params = {
                statusMode: $(this).data('status-mode').substring(0, 1),
                statusCheck: []
            };

            // 체크된 부분 데이터 구성
            $('input[name*=statusCheck]:checked').each(function (idx) {
                params.statusCheck.push($(this).val());
            });
            switch (params.statusMode) {
                case 'e':
                    title = '교환';
                    break;
                case 'b':
                    title = '반품';
                    break;
                case 'r':
                    title = '환불';
                    break;
            }

            $.post('layer_user_reject.php', params, function (data) {
                layer_popup(data, '고객 ' + title + '신청 거절처리');
            });
        }
    });

    // 사용자 환불/교환/반품신청 페이지 리스트에서 고객메모 보기
    $('.js-user-memo').click(function (e) {
        var title = null;
        var params = {
            orderNo: $(this).closest('td').data('order-no'),
            userHandleSno: $(this).closest('td').data('handle-sno'),
            statusMode: $(this).closest('td').data('status-mode')
        };
        switch (params.statusMode) {
            case 'e':
                title = '교환';
                break;
            case 'b':
                title = '반품';
                break;
            case 'r':
                title = '환불';
                break;
        }
        $.post('layer_user_memo.php', params, function (data) {
            layer_popup(data, '고객 ' + title + '신청 메모');
        });
    });

    // 주문리스트 관리자 메모 보기
    $('.js-super-admin-memo').click(function (e) {
        var params = {
            orderNo: $(this).closest('td').data('order-no'),
            regDt: $(this).closest('td').data('reg-date')
        };
        $.post('layer_super_admin_memo.php', params, function (data) {
            layer_popup(data, '관리자 메모');
        });
    });

    // 사용자 환불/교환/반품신청 페이지 리스트에서 운영자메모 보기
    $('.js-admin-memo').click(function (e) {
        var title = null;
        var params = {
            orderNo: $(this).closest('td').data('order-no'),
            userHandleSno: $(this).closest('td').data('handle-sno'),
            statusMode: $(this).closest('td').data('status-mode')
        };
        switch (params.statusMode) {
            case 'e':
                title = '교환';
                break;
            case 'b':
                title = '반품';
                break;
            case 'r':
                title = '환불';
                break;
        }
        $.post('layer_admin_memo.php', params, function (data) {
            layer_popup(data, '운영자 ' + title + '관리 메모');
        });
    });

    // 주문검색 > 기획전선택 레이어
    $('.js-layer-event').click(function (e) {
        var orderCd = [];
        $('input[name*=\'bundle[orderCd]\']:hidden').each(function (idx) {
            orderCd.push($(this).val());
        });

        var params = {
            orderNo: $(this).closest('td').data('order-no'),
            orderCd: orderCd,
        };
        $.post('../share/layer_event.php', params, function (data) {
            layer_popup(data, '쿠폰 선택', 'normal');
        });
    });

    //쿠폰사용 주문 전체 검색
    $("input[name='couponAllFl']").click(function(e){
        if($(this).is(":checked") === true){
            $("#couponLayer").empty();
        }
    });
});

/**
 * 주문 상태 변경 처리
 *
 * @param string orderNo 주문 번호
 */
function status_process_payment(orderNo) {
    var alertMsg = '[' + orderNo + '] 주문을 입금 확인 처리 하시겠습니까?';
    if (confirm(alertMsg) == true) {
        $.post('order_ps.php', {mode: 'status_payment', orderNo: orderNo}, function (data) {
            if (data == '') {
                location.reload();
            } else {
                alert('오류로 인해 처리 되지 않았습니다.');
            }
        });
    }
}

/**
 * 엑셀 다운로드 약식 팝업창
 */
function manage_formtype() {
    frame_popup('order_list_download_form.php', 700, 700, '다운로드 양식관리');
}

/**
 * 주문내역 엑셀 다운
 */
function download_excel() {
    if ($('[name=\'formSno\']').val() == '') {
        alert('다운로드 양식을 선택해주세요.');
        return false;
    }
    if ($('[name=\'excelStatus[]\']:checked').length == 0) {
        alert('주문내역 다운 범위를 선택해 주세요');
        return false;
    }
    $('form[name=\'frmExcelDown\']').submit();
}

/**
 * 송장 엑셀파일 업로드
 */
function upload_invoice_form() {
    if (!$('[name=\'excel\']').val()) {
        alert("업로드할 송장 엑셀파일을 입력해 주세요.");
        return false;
    }

    if (confirm("송장 엑셀파일을 업로드 하시겠습니까?")) {
        $('form[name=\'frmExcelUpload\']').formProcess();
        $('form[name=\'frmExcelUpload\']').submit();
    }
}

/**
 * 환불관리 전용 새창
 */
function refund_view_popup(uri) {
    win = popup({
        url: uri,
        target: '',
        width: '1200',
        height: '800',
        scrollbars: 'yes',
        resizable: 'yes'
    });
    win.focus();
    return win;
}
