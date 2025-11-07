import { NextResponse } from 'next/server'

// Mock data - replace with actual database queries
const agentData = {
  profile: {
    name: 'Oyin',
    role: 'Agent',
    location: 'Lagos, Ikeja.',
    avatar: '/prof1.jpg',
    email: 'oyin@gmail.com'
  },
  // Monthly aggregated data
  monthlyData: {
    January: { totalViews: 18500, vacant: 23, totalProperties: 45, occupied: 22 },
    February: { totalViews: 19800, vacant: 21, totalProperties: 46, occupied: 25 },
    March: { totalViews: 21200, vacant: 19, totalProperties: 47, occupied: 28 },
    April: { totalViews: 22400, vacant: 18, totalProperties: 48, occupied: 30 },
    May: { totalViews: 23457, vacant: 17, totalProperties: 50, occupied: 33 },
    June: { totalViews: 24100, vacant: 16, totalProperties: 51, occupied: 35 },
    July: { totalViews: 25300, vacant: 15, totalProperties: 52, occupied: 37 },
    August: { totalViews: 26800, vacant: 14, totalProperties: 53, occupied: 39 },
    September: { totalViews: 27500, vacant: 13, totalProperties: 54, occupied: 41 },
    October: { totalViews: 28200, vacant: 12, totalProperties: 55, occupied: 43 },
    November: { totalViews: 29000, vacant: 11, totalProperties: 56, occupied: 45 },
    December: { totalViews: 30500, vacant: 10, totalProperties: 57, occupied: 47 }
  },
  // Daily profile views for each month (showing last 30 days)
  dailyCharts: {
    January: [
      { day: '1', views: 520 }, { day: '2', views: 580 }, { day: '3', views: 610 },
      { day: '4', views: 590 }, { day: '5', views: 620 }, { day: '6', views: 650 },
      { day: '7', views: 680 }, { day: '8', views: 700 }, { day: '9', views: 690 },
      { day: '10', views: 720 }, { day: '11', views: 710 }, { day: '12', views: 740 },
      { day: '13', views: 760 }, { day: '14', views: 750 }, { day: '15', views: 780 },
      { day: '16', views: 800 }, { day: '17', views: 790 }, { day: '18', views: 820 },
      { day: '19', views: 810 }, { day: '20', views: 830 }, { day: '21', views: 850 },
      { day: '22', views: 840 }, { day: '23', views: 860 }, { day: '24', views: 880 },
      { day: '25', views: 870 }, { day: '26', views: 890 }, { day: '27', views: 900 },
      { day: '28', views: 920 }, { day: '29', views: 910 }, { day: '30', views: 930 }
    ],
    February: [
      { day: '1', views: 600 }, { day: '2', views: 630 }, { day: '3', views: 660 },
      { day: '4', views: 650 }, { day: '5', views: 680 }, { day: '6', views: 700 },
      { day: '7', views: 720 }, { day: '8', views: 740 }, { day: '9', views: 730 },
      { day: '10', views: 760 }, { day: '11', views: 750 }, { day: '12', views: 780 },
      { day: '13', views: 800 }, { day: '14', views: 790 }, { day: '15', views: 820 },
      { day: '16', views: 840 }, { day: '17', views: 830 }, { day: '18', views: 860 },
      { day: '19', views: 850 }, { day: '20', views: 880 }, { day: '21', views: 900 },
      { day: '22', views: 890 }, { day: '23', views: 920 }, { day: '24', views: 940 },
      { day: '25', views: 930 }, { day: '26', views: 950 }, { day: '27', views: 970 },
      { day: '28', views: 960 }
    ],
    March: [
      { day: '1', views: 650 }, { day: '2', views: 680 }, { day: '3', views: 700 },
      { day: '4', views: 720 }, { day: '5', views: 740 }, { day: '6', views: 760 },
      { day: '7', views: 780 }, { day: '8', views: 800 }, { day: '9', views: 790 },
      { day: '10', views: 820 }, { day: '11', views: 810 }, { day: '12', views: 840 },
      { day: '13', views: 860 }, { day: '14', views: 850 }, { day: '15', views: 880 },
      { day: '16', views: 900 }, { day: '17', views: 890 }, { day: '18', views: 920 },
      { day: '19', views: 910 }, { day: '20', views: 940 }, { day: '21', views: 960 },
      { day: '22', views: 950 }, { day: '23', views: 980 }, { day: '24', views: 1000 },
      { day: '25', views: 990 }, { day: '26', views: 1020 }, { day: '27', views: 1040 },
      { day: '28', views: 1030 }, { day: '29', views: 1050 }, { day: '30', views: 1070 }
    ],
    April: [
      { day: '1', views: 700 }, { day: '2', views: 720 }, { day: '3', views: 740 },
      { day: '4', views: 760 }, { day: '5', views: 780 }, { day: '6', views: 800 },
      { day: '7', views: 820 }, { day: '8', views: 840 }, { day: '9', views: 830 },
      { day: '10', views: 860 }, { day: '11', views: 850 }, { day: '12', views: 880 },
      { day: '13', views: 900 }, { day: '14', views: 890 }, { day: '15', views: 920 },
      { day: '16', views: 940 }, { day: '17', views: 930 }, { day: '18', views: 960 },
      { day: '19', views: 950 }, { day: '20', views: 980 }, { day: '21', views: 1000 },
      { day: '22', views: 990 }, { day: '23', views: 1020 }, { day: '24', views: 1040 },
      { day: '25', views: 1030 }, { day: '26', views: 1060 }, { day: '27', views: 1080 },
      { day: '28', views: 1070 }, { day: '29', views: 1100 }, { day: '30', views: 1120 }
    ],
    May: [
      { day: '1', views: 720 }, { day: '2', views: 750 }, { day: '3', views: 780 },
      { day: '4', views: 800 }, { day: '5', views: 820 }, { day: '6', views: 850 },
      { day: '7', views: 870 }, { day: '8', views: 890 }, { day: '9', views: 880 },
      { day: '10', views: 910 }, { day: '11', views: 900 }, { day: '12', views: 930 },
      { day: '13', views: 950 }, { day: '14', views: 940 }, { day: '15', views: 970 },
      { day: '16', views: 990 }, { day: '17', views: 980 }, { day: '18', views: 1010 },
      { day: '19', views: 1000 }, { day: '20', views: 1030 }, { day: '21', views: 1050 },
      { day: '22', views: 1040 }, { day: '23', views: 1070 }, { day: '24', views: 1090 },
      { day: '25', views: 1080 }, { day: '26', views: 1110 }, { day: '27', views: 1130 },
      { day: '28', views: 1120 }, { day: '29', views: 1150 }, { day: '30', views: 1170 }
    ],
    June: [
      { day: '1', views: 750 }, { day: '2', views: 780 }, { day: '3', views: 810 },
      { day: '4', views: 830 }, { day: '5', views: 850 }, { day: '6', views: 880 },
      { day: '7', views: 900 }, { day: '8', views: 920 }, { day: '9', views: 910 },
      { day: '10', views: 940 }, { day: '11', views: 930 }, { day: '12', views: 960 },
      { day: '13', views: 980 }, { day: '14', views: 970 }, { day: '15', views: 1000 },
      { day: '16', views: 1020 }, { day: '17', views: 1010 }, { day: '18', views: 1040 },
      { day: '19', views: 1030 }, { day: '20', views: 1060 }, { day: '21', views: 1080 },
      { day: '22', views: 1070 }, { day: '23', views: 1100 }, { day: '24', views: 1120 },
      { day: '25', views: 1110 }, { day: '26', views: 1140 }, { day: '27', views: 1160 },
      { day: '28', views: 1150 }, { day: '29', views: 1180 }, { day: '30', views: 1200 }
    ],
    July: [
      { day: '1', views: 780 }, { day: '2', views: 810 }, { day: '3', views: 840 },
      { day: '4', views: 860 }, { day: '5', views: 880 }, { day: '6', views: 910 },
      { day: '7', views: 930 }, { day: '8', views: 950 }, { day: '9', views: 940 },
      { day: '10', views: 970 }, { day: '11', views: 960 }, { day: '12', views: 990 },
      { day: '13', views: 1010 }, { day: '14', views: 1000 }, { day: '15', views: 1030 },
      { day: '16', views: 1050 }, { day: '17', views: 1040 }, { day: '18', views: 1070 },
      { day: '19', views: 1060 }, { day: '20', views: 1090 }, { day: '21', views: 1110 },
      { day: '22', views: 1100 }, { day: '23', views: 1130 }, { day: '24', views: 1150 },
      { day: '25', views: 1140 }, { day: '26', views: 1170 }, { day: '27', views: 1190 },
      { day: '28', views: 1180 }, { day: '29', views: 1210 }, { day: '30', views: 1230 }
    ],
    August: [
      { day: '1', views: 820 }, { day: '2', views: 850 }, { day: '3', views: 880 },
      { day: '4', views: 900 }, { day: '5', views: 920 }, { day: '6', views: 950 },
      { day: '7', views: 970 }, { day: '8', views: 990 }, { day: '9', views: 980 },
      { day: '10', views: 1010 }, { day: '11', views: 1000 }, { day: '12', views: 1030 },
      { day: '13', views: 1050 }, { day: '14', views: 1040 }, { day: '15', views: 1070 },
      { day: '16', views: 1090 }, { day: '17', views: 1080 }, { day: '18', views: 1110 },
      { day: '19', views: 1100 }, { day: '20', views: 1130 }, { day: '21', views: 1150 },
      { day: '22', views: 1140 }, { day: '23', views: 1170 }, { day: '24', views: 1190 },
      { day: '25', views: 1180 }, { day: '26', views: 1210 }, { day: '27', views: 1230 },
      { day: '28', views: 1220 }, { day: '29', views: 1250 }, { day: '30', views: 1270 }
    ],
    September: [
      { day: '1', views: 850 }, { day: '2', views: 880 }, { day: '3', views: 910 },
      { day: '4', views: 930 }, { day: '5', views: 950 }, { day: '6', views: 980 },
      { day: '7', views: 1000 }, { day: '8', views: 1020 }, { day: '9', views: 1010 },
      { day: '10', views: 1040 }, { day: '11', views: 1030 }, { day: '12', views: 1060 },
      { day: '13', views: 1080 }, { day: '14', views: 1070 }, { day: '15', views: 1100 },
      { day: '16', views: 1120 }, { day: '17', views: 1110 }, { day: '18', views: 1140 },
      { day: '19', views: 1130 }, { day: '20', views: 1160 }, { day: '21', views: 1180 },
      { day: '22', views: 1170 }, { day: '23', views: 1200 }, { day: '24', views: 1220 },
      { day: '25', views: 1210 }, { day: '26', views: 1240 }, { day: '27', views: 1260 },
      { day: '28', views: 1250 }, { day: '29', views: 1280 }, { day: '30', views: 1300 }
    ],
    October: [
      { day: '1', views: 880 }, { day: '2', views: 910 }, { day: '3', views: 940 },
      { day: '4', views: 960 }, { day: '5', views: 980 }, { day: '6', views: 1010 },
      { day: '7', views: 1030 }, { day: '8', views: 1050 }, { day: '9', views: 1040 },
      { day: '10', views: 1070 }, { day: '11', views: 1060 }, { day: '12', views: 1090 },
      { day: '13', views: 1110 }, { day: '14', views: 1100 }, { day: '15', views: 1130 },
      { day: '16', views: 1150 }, { day: '17', views: 1140 }, { day: '18', views: 1170 },
      { day: '19', views: 1160 }, { day: '20', views: 1190 }, { day: '21', views: 1210 },
      { day: '22', views: 1200 }, { day: '23', views: 1230 }, { day: '24', views: 1250 },
      { day: '25', views: 1240 }, { day: '26', views: 1270 }, { day: '27', views: 1290 },
      { day: '28', views: 1280 }, { day: '29', views: 1310 }, { day: '30', views: 1330 }
    ],
    November: [
      { day: '1', views: 910 }, { day: '2', views: 940 }, { day: '3', views: 970 },
      { day: '4', views: 990 }, { day: '5', views: 1010 }, { day: '6', views: 1040 },
      { day: '7', views: 1060 }, { day: '8', views: 1080 }, { day: '9', views: 1070 },
      { day: '10', views: 1100 }, { day: '11', views: 1090 }, { day: '12', views: 1120 },
      { day: '13', views: 1140 }, { day: '14', views: 1130 }, { day: '15', views: 1160 },
      { day: '16', views: 1180 }, { day: '17', views: 1170 }, { day: '18', views: 1200 },
      { day: '19', views: 1190 }, { day: '20', views: 1220 }, { day: '21', views: 1240 },
      { day: '22', views: 1230 }, { day: '23', views: 1260 }, { day: '24', views: 1280 },
      { day: '25', views: 1270 }, { day: '26', views: 1300 }, { day: '27', views: 1320 },
      { day: '28', views: 1310 }, { day: '29', views: 1340 }, { day: '30', views: 1360 }
    ],
    December: [
      { day: '1', views: 950 }, { day: '2', views: 980 }, { day: '3', views: 1010 },
      { day: '4', views: 1030 }, { day: '5', views: 1050 }, { day: '6', views: 1080 },
      { day: '7', views: 1100 }, { day: '8', views: 1120 }, { day: '9', views: 1110 },
      { day: '10', views: 1140 }, { day: '11', views: 1130 }, { day: '12', views: 1160 },
      { day: '13', views: 1180 }, { day: '14', views: 1170 }, { day: '15', views: 1200 },
      { day: '16', views: 1220 }, { day: '17', views: 1210 }, { day: '18', views: 1240 },
      { day: '19', views: 1230 }, { day: '20', views: 1260 }, { day: '21', views: 1280 },
      { day: '22', views: 1270 }, { day: '23', views: 1300 }, { day: '24', views: 1320 },
      { day: '25', views: 1310 }, { day: '26', views: 1340 }, { day: '27', views: 1360 },
      { day: '28', views: 1350 }, { day: '29', views: 1380 }, { day: '30', views: 1400 }
    ]
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const month = searchParams.get('month') || 'May'
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const monthData = agentData.monthlyData[month]
    const dailyChart = agentData.dailyCharts[month]
    
    return NextResponse.json({
      success: true,
      data: {
        profile: agentData.profile,
        stats: {
          profileViews: monthData.totalViews,
          vacant: monthData.vacant,
          totalProperties: monthData.totalProperties,
          occupied: monthData.occupied
        },
        profileViewsChart: dailyChart
      }
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch agent stats' },
      { status: 500 }
    )
  }
}
