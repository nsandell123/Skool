fetch('skool_members.csv')
  .then(response => response.text())
  .then(data => {
    // Parse CSV data
    const rows = data.trim().split('\n').slice(1);
    const chartData = rows.map(row => {
      const [date, members] = row.split(',');
      return {
        x: new Date(date.replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3')),
        y: parseInt(members)
      };
    });

    // Remove duplicates and sort by date
    const uniqueData = Array.from(new Map(
      chartData.map(item => [item.x.getTime(), item])
    ).values()).sort((a, b) => a.x - b.x);

    // Create chart
    const ctx = document.getElementById('membershipChart');
    new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          data: uniqueData,
          fill: true,
          backgroundColor: 'rgba(255, 102, 0, 0.2)',
          borderColor: 'rgba(255, 102, 0, 0.8)',
          tension: 0.3,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: '#ffffff',
          pointHoverBorderColor: 'rgba(255, 102, 0, 1)',
          pointHoverBorderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            callbacks: {
              title: function(context) {
                // Format the date to only show the date part
                const date = new Date(context[0].parsed.x);
                return date.toLocaleDateString('en-US', { 
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                });
              }
            }
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'month',
              displayFormats: {
                month: 'MMM yyyy'
              }
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.15)'
            },
            ticks: {
              color: '#ffffff'
            },
            title: {
              display: true,
              text: 'Date',
              color: '#ffffff',
              font: {
                size: 14,
                family: "Arial"
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#ffffff',
              callback: function(value) {
                return value.toLocaleString(); // Adds commas to numbers
              }
            },
            title: {
              display: true,
              text: 'Members',
              color: '#ffffff',
              font: {
                size: 14,
                family: "Arial"
              }
            }
          }
        }
      }
    });
  });
