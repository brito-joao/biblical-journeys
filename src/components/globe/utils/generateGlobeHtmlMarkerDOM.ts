import { Language } from "@/lib/i18n";
import { TimelineEvent } from "@/types";

export function generateGlobeHtmlMarkerDOM(
    eventData: object,
    activeEventOrderId: number,
    onMarkerClicked: (event: TimelineEvent) => void,
    language: Language
): HTMLElement {
    const containerElement = document.createElement('div');
    const timelineEvent = eventData as TimelineEvent;
    const isCurrentlyActive = timelineEvent.order === activeEventOrderId;
    
    containerElement.setAttribute('data-order', timelineEvent.order.toString());

    const textColor = isCurrentlyActive ? '#8b251e' : '#3e3222';
    const textShadow = '0 1px 3px rgba(248,245,238,0.9), 0 -1px 3px rgba(248,245,238,0.9), 1px 0 3px rgba(248,245,238,0.9), -1px 0 3px rgba(248,245,238,0.9)';

    containerElement.innerHTML = `
        <style>
            .marker-container { position: relative; width: 0; height: 0; pointer-events: auto; cursor: pointer; }
            .city-label { opacity: 0; pointer-events: none; transition: opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1); }
            .marker-container:hover .city-label { opacity: 1; z-index: 200; }
            .city-label.active { opacity: 1; z-index: 100; pointer-events: auto; }
        </style>
        <div class="marker-container">
            <!-- The city dot itself, perfectly centered right on the 0,0 origin of this container -->
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${isCurrentlyActive ? '18px' : '12px'};
                height: ${isCurrentlyActive ? '18px' : '12px'};
                background: ${isCurrentlyActive ? '#8b251e' : '#e3d8c4'};
                border-radius: 50%;
                border: ${isCurrentlyActive ? '3px solid #b89947' : '2px solid #5c4a35'};
                box-shadow: ${isCurrentlyActive ? 'inset 0 2px 4px rgba(0,0,0,0.4), 0 4px 10px rgba(62,50,34,0.4)' : 'inset 0 1px 2px rgba(0,0,0,0.2), 0 2px 4px rgba(62,50,34,0.2)'};
                transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            "></div>

            <!-- The text label floating above the dot -->
            <span class="city-label ${isCurrentlyActive ? 'active' : ''}" style="
                position: absolute;
                bottom: ${isCurrentlyActive ? '15px' : '10px'};
                left: 50%;
                transform: translateX(-50%);
                font-family: 'Merriweather', serif;
                font-size: ${isCurrentlyActive ? '20px' : '15px'};
                font-weight: ${isCurrentlyActive ? '800' : '700'};
                letter-spacing: 0.05em;
                color: ${textColor};
                text-shadow: ${textShadow};
                white-space: nowrap;
            ">
                <div style="
                margin-top: 4px;
                font-family: var(--font-merriweather, serif);
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-transform: uppercase;
                color: ${textColor};
                text-shadow: ${textShadow};
                white-space: nowrap;
                transition: opacity 0.3s ease;
                pointer-events: auto;
                cursor: pointer;
            ">
                ${typeof timelineEvent.city === 'string' ? timelineEvent.city : (timelineEvent.city[language] || timelineEvent.city.en)}
            </div>
            </span>
        </div>
    `;
    
    // Wire native UI interactions directly connecting back to React execution models
    containerElement.onclick = () => {
        onMarkerClicked(timelineEvent);
    };

    return containerElement;
}
