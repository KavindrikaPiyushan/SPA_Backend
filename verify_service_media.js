// using native fetch

const BASE_URL = 'http://localhost:3000/api/services';

const log = (msg, data) => console.log(`[TEST] ${msg}`, data ? JSON.stringify(data, null, 2) : '');

async function runTest() {
    try {
        // 1. Create Service
        log('Creating Service...');
        const createRes = await fetch(`${BASE_URL}/createService`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Setup Service',
                duration: 60,
                description: 'Testing media handling',
                aid: 1, // Mock admin ID
                media: [{ url: 'http://example.com/img1.jpg', type: 'image' }]
            })
        });
        const createData = await createRes.json();
        log('Create Response:', createData);
        if (!createData.sid) throw new Error('Failed to create service');
        const sid = createData.sid;

        // 2. Get All Services
        log('Getting All Services...');
        const getAllRes = await fetch(`${BASE_URL}/getServices`);
        const services = await getAllRes.json();
        const createdService = services.find(s => s.sid === sid);
        
        if (!createdService) throw new Error('Created service not found in list');
        log('Created Service from List:', createdService);
        
        if (typeof createdService.media === 'string') {
             throw new Error('Media in getServices is still a string!');
        }
        log('Media in getServices is correctly parsed.');

        // 3. Get Service By ID
        log(`Getting Service by ID: ${sid}...`);
        const getByIdRes = await fetch(`${BASE_URL}/getService/${sid}`);
        const serviceById = await getByIdRes.json();
        log('Service By ID:', serviceById);

        if (typeof serviceById.media === 'string') {
             throw new Error('Media in getServiceById is still a string!');
        }
         log('Media in getServiceById is correctly parsed.');

        // 4. Update Service
        log(`Updating Service: ${sid}...`);
        const updateRes = await fetch(`${BASE_URL}/updateService/${sid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                media: ['updated-image.jpg'],
                aid: 1 // Sending aid just in case, though controller doesn't need it for WHERE anymore
            })
        });
        const updateData = await updateRes.json();
        log('Update Response:', updateData);

        // 5. Verify Update
        const verifyUpdateRes = await fetch(`${BASE_URL}/getService/${sid}`);
        const updatedService = await verifyUpdateRes.json();
        log('Updated Service:', updatedService);
        if (updatedService.media[0] !== 'updated-image.jpg') {
            throw new Error('Media update failed or not reflected');
        }
        log('Media update verified.');

        // 6. Delete Service
        log(`Deleting Service: ${sid}...`);
        const deleteRes = await fetch(`${BASE_URL}/deleteService/${sid}`, {
            method: 'DELETE',
        });
        const deleteData = await deleteRes.json();
        log('Delete Response:', deleteData);

        // 7. Verify Deletion
        const verifyDeleteRes = await fetch(`${BASE_URL}/getService/${sid}`);
        if (verifyDeleteRes.status === 404) {
            log('Service successfully deleted (404 returned).');
        } else {
             const verifyDeleteData = await verifyDeleteRes.json(); // Consuming body to be safe
             if(verifyDeleteData.message === "Service not found") {
                log('Service successfully deleted (Service not found message).');
             } else {
                 log('Behavior after delete:', verifyDeleteData);
                // Depending on getServiceById impl, it might return empty or 404. We added 404 check so it should be status 404.
                if (verifyDeleteRes.status !== 404) throw new Error('Service still exists after delete');
             }
        }

        console.log('ALL TESTS PASSED');

    } catch (error) {
        console.error('TEST FAILED:', error);
    }
}

runTest();
