// Entirely fictional figures for layout review. Never label these real traffic.
window.VAYAM_DASHBOARD_SAMPLE = Object.freeze({
  schemaVersion: 1,
  label: 'Illustrative 28-day period',
  summary: {visitors: 1120, visits: 1620, productInterest: 438, handoffs: 44},
  trend: [
    [1,31,1],[2,35,0],[3,29,2],[4,42,1],[5,39,2],[6,25,0],[7,28,1],
    [8,36,2],[9,41,1],[10,43,3],[11,39,1],[12,46,2],[13,32,0],[14,27,1],
    [15,44,2],[16,48,1],[17,51,3],[18,47,2],[19,53,2],[20,34,1],[21,31,1],
    [22,49,2],[23,56,4],[24,59,2],[25,57,3],[26,61,2],[27,38,1],[28,42,1]
  ],
  countries: [
    {name:'India',code:'IN',value:318},{name:'United Arab Emirates',code:'AE',value:208},
    {name:'United States',code:'US',value:190},{name:'United Kingdom',code:'GB',value:155},
    {name:'Germany',code:'DE',value:111},{name:'Brazil',code:'BR',value:88}
  ],
  sources: [
    {name:'Organic search',value:660,color:'#e8894a'},{name:'Direct / unknown',value:435,color:'#12392b'},
    {name:'Social and referral',value:310,color:'#8ca765'},{name:'Other',value:215,color:'#d9c9a8'}
  ],
  cities: [
    {name:'Bengaluru',country:'India',value:81},{name:'Dubai',country:'UAE',value:74},
    {name:'London',country:'United Kingdom',value:51},{name:'New York',country:'United States',value:45},
    {name:'Berlin',country:'Germany',value:39},{name:'São Paulo',country:'Brazil',value:32}
  ],
  products: [
    {name:'Whole spices & powders',value:142},{name:'Rice, pulses & grains',value:106},
    {name:'Packaged Indian foods',value:82},{name:'Private label',value:62},
    {name:'Mixed-product sourcing',value:46}
  ],
  sections: [
    {name:'Opening',value:1248},{name:'About',value:860},{name:'Products',value:704},
    {name:'Quality',value:438},{name:'Process',value:365},{name:'Documents',value:262},
    {name:'FAQ',value:203},{name:'Contact',value:154}
  ],
  funnel: [
    {name:'Measured visits',count:1620,detail:'Site entry'},
    {name:'Products reached',count:704,detail:'Section visible'},
    {name:'Product interest',count:438,detail:'Category interaction'},
    {name:'Enquiry started',count:92,detail:'First form focus'},
    {name:'Enquiry handoff',count:44,detail:'Email or WhatsApp opened'}
  ]
});
