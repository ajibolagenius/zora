import { NextRequest, NextResponse } from 'next/server';
import { VendorOnboardingService } from '@/services/vendor-onboarding';

export async function POST(request: NextRequest) {
    try {
        // Only accept POST requests
        if (request.method !== 'POST') {
            return NextResponse.json(
                { error: 'Method not allowed' },
                { status: 405 }
            );
        }

        // Parse form data
        const formData = await request.formData();

        // Convert FormData to our expected format
        const data = {
            businessName: formData.get('businessName') as string,
            businessType: formData.get('businessType') as string,
            description: formData.get('description') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            addressLine1: formData.get('addressLine1') as string,
            addressLine2: formData.get('addressLine2') as string,
            city: formData.get('city') as string,
            postcode: formData.get('postcode') as string,
            country: formData.get('country') as string,
            bankDetails: JSON.parse(formData.get('bankDetails') as string),
            coverageAreas: JSON.parse(formData.get('coverageAreas') as string),
            productCategories: JSON.parse(formData.get('productCategories') as string),
            documents: {
                businessRegistration: formData.get('businessRegistration') as File,
                idDocument: formData.get('idDocument') as File,
                proofOfAddress: formData.get('proofOfAddress') as File,
            },
            csrfToken: formData.get('csrfToken') as string,
        };

        // Validate CSRF token (implement proper validation in production)
        const csrfToken = formData.get('csrfToken') as string;
        if (!csrfToken) {
            return NextResponse.json(
                { error: 'CSRF token required' },
                { status: 400 }
            );
        }

        // Basic validation
        if (!data.businessName || !data.email || !data.phone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Process the application using the service
        const result = await VendorOnboardingService.processApplication(data);

        if (result.success) {
            return NextResponse.json(
                {
                    message: result.message,
                    applicationId: result.applicationId
                },
                { status: 200 }
            );
        } else {
            return NextResponse.json(
                {
                    error: result.message,
                    errors: result.errors
                },
                { status: 400 }
            );
        }

    } catch (error) {
        console.error('Vendor onboarding API error:', error);

        return NextResponse.json(
            {
                error: 'Internal server error',
                message: 'Failed to process application. Please try again later.'
            },
            { status: 500 }
        );
    }
}

// Handle other HTTP methods
export async function GET() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}
