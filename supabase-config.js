// Supabase Configuration + Offline Fallback
// This file now provides a unified data layer that works offline.

const SUPABASE_URL = 'https://rhxuivbxxwaccbaltqbr.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJoeHVpdmJ4eHdhY2NiYWx0cWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc1MTU2OTksImV4cCI6MjA3MzA5MTY5OX0.Yk5jfKhUiS6txrSLNHMFQWT2cECHWpWc_tithtb115A'; // Get this from Supabase dashboard

// Initialize Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Offline-first helpers ---
const LOCAL_STORAGE_KEY = 'poopLogsProV2';

function loadLocal() {
    try {
        return JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
    } catch {
        return [];
    }
}

function saveLocal(entries) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(entries || []));
}

async function canReachSupabase() {
    try {
        const { error } = await supabaseClient.from('poop_entries').select('id').limit(1);
        return !error;
    } catch {
        return false;
    }
}

function isGuestMode() {
    return localStorage.getItem('guestMode') === 'true';
}

// Local database implementation with same shape as PoopDB
const LocalDB = {
    async getAllEntries() {
        const data = loadLocal();
        return data;
    },
    async createEntry(entry) {
        const data = loadLocal();
        const exists = data.some(e => e.id === entry.id);
        const clean = {
            id: entry.id,
            timestamp: entry.timestamp,
            duration: entry.duration,
            bristol: entry.bristol,
            color: entry.color,
            volume: entry.volume,
            shape: entry.shape || null,
            smell: entry.smell || null,
            pain: entry.pain,
            hasBlood: !!entry.hasBlood,
            hasMucus: !!entry.hasMucus,
            symptoms: entry.symptoms || [],
            notes: entry.notes || null
        };
        if (!exists) data.unshift(clean);
        else {
            const idx = data.findIndex(e => e.id === entry.id);
            data[idx] = clean;
        }
        saveLocal(data);
        return clean;
    },
    async updateEntry(id, updates) {
        const data = loadLocal();
        const idx = data.findIndex(e => e.id === id);
        if (idx === -1) return null;
        data[idx] = { ...data[idx], ...updates };
        saveLocal(data);
        return data[idx];
    },
    async deleteEntry(id) {
        const data = loadLocal().filter(e => e.id !== id);
        saveLocal(data);
        return true;
    },
    async deleteAllEntries() {
        saveLocal([]);
        return true;
    }
};

// Choose DB based on availability/guest mode
let ActiveDB = null;
async function getDB() {
    if (ActiveDB) return ActiveDB;
    if (isGuestMode()) {
        ActiveDB = LocalDB;
        return ActiveDB;
    }
    const reachable = await canReachSupabase();
    ActiveDB = reachable ? PoopDB : LocalDB;
    return ActiveDB;
}

// Auth helper functions
const Auth = {
    // Check if user is logged in
    async getUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    },

    // Check if user is authenticated
    async isAuthenticated() {
        const { data: { session } } = await supabaseClient.auth.getSession();
        return !!session;
    },

    // Sign out
    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        window.location.href = 'auth.html';
    },

    // Get user profile
    async getProfile() {
        const user = await this.getUser();
        if (!user) return null;

        const { data, error } = await supabaseClient
            .from('user_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error) {
            console.error('Error fetching profile:', error);
            return null;
        }
        return data;
    },

    // Update user profile
    async updateProfile(updates) {
        const user = await this.getUser();
        if (!user) throw new Error('Not authenticated');

        const { data, error } = await supabaseClient
            .from('user_profiles')
            .update(updates)
            .eq('id', user.id)
            .select();

        if (error) throw error;
        return data[0];
    }
};

// Database helper functions (Supabase)
const PoopDB = {
    // Get all entries for current user
    async getAllEntries() {
        try {
            const { data, error } = await supabaseClient
                .from('poop_entries')
                .select('*')
                .order('timestamp', { ascending: false });
            
            if (error) throw error;
            
            // Map snake_case -> camelCase for consistency with LocalDB
            return (data || []).map(entry => ({
                id: entry.id,
                timestamp: entry.timestamp,
                duration: entry.duration,
                bristol: entry.bristol,
                color: entry.color,
                volume: entry.volume,
                shape: entry.shape,
                smell: entry.smell,
                pain: entry.pain,
                hasBlood: entry.has_blood,
                hasMucus: entry.has_mucus,
                symptoms: entry.symptoms,
                notes: entry.notes
            }));
        } catch (error) {
            console.error('Error fetching entries:', error);
            return [];
        }
    },

    // Create new entry
    async createEntry(entry) {
        try {
            const { data, error } = await supabaseClient
                .from('poop_entries')
                .insert([{
                    id: entry.id,
                    timestamp: entry.timestamp,
                    duration: entry.duration,
                    bristol: entry.bristol,
                    color: entry.color,
                    volume: entry.volume,
                    shape: entry.shape,
                    smell: entry.smell,
                    pain: entry.pain,
                    has_blood: entry.hasBlood,
                    has_mucus: entry.hasMucus,
                    symptoms: entry.symptoms,
                    notes: entry.notes
                }])
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error creating entry:', error);
            throw error;
        }
    },

    // Update entry
    async updateEntry(id, updates) {
        try {
            const { data, error } = await supabaseClient
                .from('poop_entries')
                .update(updates)
                .eq('id', id)
                .select();
            
            if (error) throw error;
            return data[0];
        } catch (error) {
            console.error('Error updating entry:', error);
            throw error;
        }
    },

    // Delete entry
    async deleteEntry(id) {
        try {
            const { error } = await supabaseClient
                .from('poop_entries')
                .delete()
                .eq('id', id);
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting entry:', error);
            throw error;
        }
    },

    // Delete all entries
    async deleteAllEntries() {
        try {
            const { error } = await supabaseClient
                .from('poop_entries')
                .delete()
                .neq('id', ''); // Delete all rows
            
            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error deleting all entries:', error);
            throw error;
        }
    },

    // Sync localStorage to Supabase (for migration)
    async syncLocalToSupabase() {
        try {
            const localData = JSON.parse(localStorage.getItem('poopLogsProV2') || '[]');
            
            if (localData.length === 0) {
                return { success: true, count: 0 };
            }

            // Transform localStorage format to Supabase format
            const entries = localData.map(entry => ({
                id: entry.id,
                timestamp: entry.timestamp,
                duration: entry.duration,
                bristol: entry.bristol,
                color: entry.color,
                volume: entry.volume,
                shape: entry.shape || null,
                smell: entry.smell || null,
                pain: entry.pain,
                has_blood: entry.hasBlood || false,
                has_mucus: entry.hasMucus || false,
                symptoms: entry.symptoms || [],
                notes: entry.notes || null
            }));

            const { data, error } = await supabaseClient
                .from('poop_entries')
                .upsert(entries, { onConflict: 'id' });
            
            if (error) throw error;
            
            return { success: true, count: entries.length };
        } catch (error) {
            console.error('Error syncing to Supabase:', error);
            return { success: false, error: error.message };
        }
    },

    // Backup Supabase data to localStorage
    async backupToLocal() {
        try {
            const entries = await this.getAllEntries();
            
            // Transform unified format to LocalDB format
            const localFormat = entries.map(entry => ({
                id: entry.id,
                timestamp: entry.timestamp,
                duration: entry.duration,
                bristol: entry.bristol,
                color: entry.color,
                volume: entry.volume,
                shape: entry.shape,
                smell: entry.smell,
                pain: entry.pain,
                hasBlood: entry.hasBlood,
                hasMucus: entry.hasMucus,
                symptoms: entry.symptoms || [],
                notes: entry.notes
            }));

            saveLocal(localFormat);
            return { success: true, count: localFormat.length };
        } catch (error) {
            console.error('Error backing up to local:', error);
            return { success: false, error: error.message };
        }
    }
};

// Unified API surface used by pages
const DB = {
    async getAllEntries() {
        const db = await getDB();
        return db.getAllEntries();
    },
    async createEntry(entry) {
        const db = await getDB();
        return db.createEntry(entry);
    },
    async updateEntry(id, updates) {
        const db = await getDB();
        return db.updateEntry(id, updates);
    },
    async deleteEntry(id) {
        const db = await getDB();
        return db.deleteEntry(id);
    },
    async deleteAllEntries() {
        const db = await getDB();
        return db.deleteAllEntries();
    },
    async syncLocalToSupabase() {
        // Try to push local changes when online
        const reachable = await canReachSupabase();
        if (!reachable) return { success: false, error: 'Supabase unreachable' };
        return PoopDB.syncLocalToSupabase();
    },
    async backupToLocal() {
        return PoopDB.backupToLocal();
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PoopDB, LocalDB, DB, supabaseClient };
}
