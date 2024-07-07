const supabase = require('../config/superbase');

// 일정 추가 스케쥴
async function addSchedule(mem_id ,msche_title, msche_st_dt, msche_ed_dt,msche_color) {
        const { data, error } = await supabase
            .from('tb_member_schedule')
            .insert([{'mem_id':mem_id ,'msche_title' : msche_title, 'msche_st_dt' : msche_st_dt, 'msche_ed_dt' : msche_ed_dt, 'msche_color' : msche_color}])
            
        if (error) throw error;       
        return data;
    } 
async function deleteSchedule(mem_id,msche_title,msche_st_dt, msche_ed_dt) {
    const { data, error } = await supabase
        .from('tb_member_schedule')
        .delete()
        .match({ 'mem_id': mem_id,'msche_title':msche_title, 'msche_st_dt': msche_st_dt, 'msche_ed_dt': msche_ed_dt });

    if (error) throw error;
    return data;
    }

async function memberSchedule(mem_id) {
    try {
        const { data, error } = await supabase
            .from('tb_member_schedule')
            .select('msche_title ,msche_st_dt, msche_ed_dt,msche_color')
            .eq('mem_id', mem_id);

        if (error) throw error;
        // FullCalendar가 요구하는 형식으로 데이터 변환
        const event = data.map(item => ({
            title: item.msche_title,
            start: item.msche_st_dt,
            end: item.msche_ed_dt,
            color: item.msche_color
            // 필요한 경우 추가적인 속성들을 설정할 수 있음
        }));
        return event;

        } catch (error) {
            throw new Error(`Failed to fetch member schedule: ${error.message}`);
        }
    }

async function searchSchedule(mem_id,msche_title){
    if (!mem_id || !msche_title) {
        throw new Error('Invalid mem_id or msche_title');
        }

    try {
        const { data, error } = await supabase
            .from('tb_member_schedule')
            .select('msche_title, msche_st_dt, msche_ed_dt')
            .eq('mem_id', mem_id)
            .like('msche_title', `%${msche_title}%`); // 부분 일치 검색

        console.log(data);

        if (error) {
            console.error('Error fetching data:', error.message);
            throw error;
        }

        return data;
    } catch (err) {
        console.error('Unexpected error:', err.message);
        throw err;
        }
    }
module.exports = {addSchedule, deleteSchedule, memberSchedule, searchSchedule};