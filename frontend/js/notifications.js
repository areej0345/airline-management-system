const NotificationSystem = {

  notifications: JSON.parse(localStorage.getItem('airline_notifications') || '[]'),

  save() {
    localStorage.setItem('airline_notifications', JSON.stringify(this.notifications));
  },

  add(type, title, message, icon) {
    const notif = {
      id: Date.now(),
      type,
      title,
      message,
      icon,
      time: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };
    this.notifications.unshift(notif);
    if (this.notifications.length > 50) this.notifications.pop();
    this.save();
    this.updateBadge();
    this.showToast(type, title, message, icon);
    this.renderPanel();
    this.browserNotification(title, message);
  },

  showToast(type, title, message, icon) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <div class="toast-icon">${icon}</div>
      <div class="toast-body">
        <div class="toast-title">${title}</div>
        <div class="toast-msg">${message}</div>
      </div>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease forwards';
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  browserNotification(title, message) {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      new Notification('✈️ AirLine MS — ' + title, { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification('✈️ AirLine MS — ' + title, { body: message });
        }
      });
    }
  },

  updateBadge() {
    const badge = document.getElementById('bellBadge');
    if (badge) {
      badge.textContent = this.notifications.length;
      badge.style.display = this.notifications.length > 0 ? 'flex' : 'none';
    }
  },

  renderPanel() {
    const list = document.getElementById('notifList');
    if (!list) return;
    if (this.notifications.length === 0) {
      list.innerHTML = '<div class="notif-empty">🔔 No notifications yet</div>';
      return;
    }
    list.innerHTML = this.notifications.map(n => `
      <div class="notif-item">
        <div class="notif-item-icon">${n.icon}</div>
        <div class="notif-item-text">
          <div class="notif-item-title">${n.title}</div>
          <div class="notif-item-desc">${n.message}</div>
          <div class="notif-item-time">${n.date} at ${n.time}</div>
        </div>
      </div>
    `).join('');
  },

  togglePanel() {
    const panel = document.getElementById('notifPanel');
    if (panel) panel.classList.toggle('open');
    this.renderPanel();
  },

  clearAll() {
    this.notifications = [];
    this.save();
    this.updateBadge();
    this.renderPanel();
  },

  init() {
    this.updateBadge();
    this.renderPanel();
    Notification.requestPermission();
  }
};

// Notification Functions
function notifyBooking(ref, flight) {
  NotificationSystem.add(
    'success',
    'Booking Confirmed!',
    `Booking Reference: ${ref} — Flight ${flight} has been booked successfully.`,
    '🎫'
  );
}

function notifyFlightStatus(flight, status) {
  const type = status === 'Cancelled' ? 'error' : 'warning';
  const icon = status === 'Cancelled' ? '❌' : '⚠️';
  NotificationSystem.add(
    type,
    `Flight ${status}!`,
    `Flight ${flight} status has been updated to ${status}.`,
    icon
  );
}

function notifySeatsLow(flight, seats) {
  NotificationSystem.add(
    'warning',
    'Seats Almost Full!',
    `Flight ${flight} has only ${seats} seats remaining. Book now!`,
    '⚠️'
  );
}

function notifyPayment(ref, status) {
  const type = status === 'Paid' ? 'success' : 'info';
  const icon = status === 'Paid' ? '💰' : '🔔';
  NotificationSystem.add(
    type,
    'Payment Update!',
    `Payment for Booking ${ref} has been marked as ${status}.`,
    icon
  );
}

function notifyPassengerAdded(name) {
  NotificationSystem.add(
    'success',
    'Passenger Added!',
    `${name} has been successfully added to the system.`,
    '👤'
  );
}

function notifyPassengerDeleted(name) {
  NotificationSystem.add(
    'error',
    'Passenger Removed!',
    `${name} has been removed from the system.`,
    '🗑️'
  );
}

function notifyFlightDeleted(flightNo) {
  NotificationSystem.add(
    'error',
    'Flight Deleted!',
    `Flight ${flightNo} has been permanently deleted.`,
    '🗑️'
  );
}

function notifyBookingCancelled(ref) {
  NotificationSystem.add(
    'error',
    'Booking Cancelled!',
    `Booking ${ref} has been successfully cancelled.`,
    '❌'
  );
}