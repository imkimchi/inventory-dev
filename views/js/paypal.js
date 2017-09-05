$(function() {
    paypal.Button.render({
        env: 'sandbox', // Or 'sandbox'
        client: {
            sandbox:    'Aepr2rcPvCpYboyxUx3ERejumjkit3lgZ8e0qAuLqahxqAsqYPiqyagVWxHIIe4RWDFM0bhWsLrfv7lb',
            production: 'Aaxeq8EMS4pfVCj3viGVzR45jCHuihuC98I8CNsb1j7hcnlmdpmTrTMoKnDu9CHyFe852BjAhfE2vy4Y'
        },

        commit: false, // Show a 'Pay Now' button

        payment: function(data, actions) {
            return actions.payment.create({
                payment: {
                    transactions: [
                        {
                            amount: { total: '1.00', currency: 'USD' },
                            description: "TEST",
                            payee: { 
                                email: "seller-inventory@gmail.com",
                                merchant_id: "Q9F9QN42M7RP4" }
                        }
                    ]
                }
            });
        },

        onAuthorize: function(data, actions) {
            return actions.payment.execute().then(function(payment) {
                console.log("payment", payment)
                // The payment is complete!
                // You can now show a confirmation message to the customer
            });
        }

    }, '#paypal');
})